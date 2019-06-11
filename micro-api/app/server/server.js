const spdy = require('spdy');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const appRoot = require('app-root-path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const rootRoute = require('../routes');

let morganFormat = ':method :url :status :res[content-length] - :response-time ms';

const start = container => {
    return new Promise((resolve, reject) => {
        const { port, ssl } = container.resolve('serverSettings');
        const repos = container.resolve('repos');
        const helpers = container.resolve('helpers');
        const logger = container.resolve('logger');
        const { requestMiddleware } = container.resolve('middlewares');
        
        if (!port)
            reject(new Error('port is require'));

        if (!repos)
            reject(new Error('repository is require'));

        const app = express();
        const hbs = exphbs.create({
            extname: 'hbs',
            helpers: helpers,
            layoutsDir: `${appRoot}/app/views/layouts`,
            partialsDir: `${appRoot}/app/views/partials`
        });

        if (process.env.NODE_ENV === 'production')
            morganFormat = 'combined';

        app.engine('.hbs', hbs.engine);
        app.set('view engine', '.hbs');
        app.set('views', `${appRoot}/app/views`);

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        app.use(helmet());
        app.use(morgan(morganFormat, { stream: logger.stream}));

        app.use(cookieParser());

        app.use(requestMiddleware.wirePreRequest);
        
        app.use('/api', rootRoute(container));

        app.use(requestMiddleware.wirePostRequest);

        app.use(requestMiddleware.wireNotFoundMiddleware);

        if (process.env.NODE === 'test') {
            const server = app.listen(port, () => resolve(server))
        } else {
            const server = spdy.createServer(ssl, app)
                .listen(port, () => resolve(server));
        }
    })
}

module.exports = Object.create({ start })
