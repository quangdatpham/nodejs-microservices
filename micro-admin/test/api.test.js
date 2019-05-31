/* eslint-env mocha */
const server = require('../server/');
const request = require('supertest');
const { createContainer, asValue } = require('awilix');

const container = createContainer();

const accountData = [
    {
        id: 12,
        username: 'quangdatpham',
        email: 'quangdat2000.pham@gmail.com',

    }, {
        id: 13,
        username: 'master',
        email: 'master.pham@master.com'
    }
]

const repos = {
    Account: {
        getAllAccounts: () => accountData,
        getAccountById: id => accountData.find(u => u.id === id)
    }
}

container.register({
    serverSettings: asValue({ port: 3000 }),
    repos: asValue(repos)
});

describe('Test API', () => {
    let app;
    beforeEach(() => {
        return server.start(container)
            .then(serv => {
                app = serv;
            });
    });

    afterEach(() => {
        app.close()
        app = null
    });

    it('should return all accounts', done => {
        request(app)
            .get('/admin/accounts/')
            .expect('Content-Type', /json/)
            .expect((err, res) => {
                if (err) throw err;

                res.body.should.containEql({
                    id: 13,
                    username: 'master',
                    email: 'master.pham@master.com'
                })
            })
            .expect(200, done);
    });

    it('should return account with id = 12', done => {
        request(app)
            .get('/admin/accounts/12')
            .expect((err, res) => {
                if (err) throw err;

                res.body.should.containEql({
                    id: 12,
                    username: 'quangdatpham',
                    email: 'quangdat2000.pham@gmail.com',
                })
            })
            .expect(200, done);
    });
});