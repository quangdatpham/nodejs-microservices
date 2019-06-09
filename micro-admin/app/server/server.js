const spdy = require('spdy');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const appRoot = require('app-root-path');

const rootRoute = require('../routes');

let morganFormat = ':method :url :status :res[content-length] - :response-time ms';

const start = container => {
    return new Promise((resolve, reject) => {
        const { port, ssl } = container.resolve('serverSettings');
        const repos = container.resolve('repos');
        const helpers = container.resolve('helpers');
        const logger = container.resolve('logger');

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

        app.use(helmet());
        app.use(morgan(morganFormat, { stream: logger.stream}));

        app.use('/admin', rootRoute(container));

        app.use((err, req, res, next) => {
            reject(new Error('Something went wrong! :{}' + err));
            res.status(500).send({
                url: req.url,
                message: err.message,
                stack: err.stack
            });
        })

        app.use((req, res, next) => {
            logger.warn(`WARN url not found :[] ${req.url}`);
            next();
        });

        app.get('/', (req, res) => {
            res.render('index', {
                title: 'Admin page'
            });
        });

        if (process.env.NODE === 'test') {
            const server = app.listen(port, () => resolve(server))
        } else {
            const server = spdy.createServer(ssl, app)
                .listen(port, () => resolve(server));
        }
    })
}

module.exports = Object.create({ start })
