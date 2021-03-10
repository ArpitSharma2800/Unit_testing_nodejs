let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

describe('Palatio', async () => {
    describe('/Check server', () => {
        it('it should return server running', (done) => {
            chai.request('http://localhost:3000')
                .get('/')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('Palatio server is running....')
                    // res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/Register', () => {
        it('it should register the user', (done) => {
            let register = {
                name: "admin2",
                email: "admin2@admin.com",
                password: "fefefe"
            }
            chai.request('http://localhost:3000')
                .post('/api/auth/register')
                .send(register)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.body.should.have.property('Name').eql(register.name);
                    // expect(res.body.Name).to.equal(register.name);
                    res.body.should.have.property('User');
                    done();
                });
        });
    });
    describe('/Login', () => {
        it('it should login the user with credential', (done) => {
            let login = {
                email: "admin@admin.com",
                password: "fefefe"
            }
            chai.request('http://localhost:3000')
                .post('/api/auth/login')
                .send(login)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    token = res.body.token
                    res.body.should.be.a('object')
                    res.body.should.have.property('useremail').eql(login.email);
                    res.body.should.have.property('username');
                    res.body.should.have.property('useremail');
                    res.body.should.have.property('user_id');
                    res.body.should.have.property('token');
                    done();
                });
        });
    });

    describe('/JWT check', () => {
        it('it should check authenticity of JWT token', (done) => {
            // let login = {
            //     email: "admin@admin.com",
            //     password: "fefefe"
            // }
            let token = 'Token'
            chai.request('http://localhost:3000')
                .get('/api/jwtCheck')
                .set({
                    "Authorization": `Bearer ${token}`
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.body.should.have.property('token').eql("verified Token");
                    res.body.should.have.property('token');
                    done();
                });
        });
    });
})