let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);
chai.use(require('chai-things'));
chai.use(require('chai-json-schema'));
token = null;
describe('Palatio', async () => {
    //TEST FOR USER REGISTRATION AND LOGIN
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
                    token = res.body.token;
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
    //END TEST FOR USER REGISTRATION AND LOGIN

    //TESTS FOR ALLERGIES RELATED QUERY

    let allAllergySchema = {
        required: ['_id', 'user_uid', 'allergy', 'date', 'ingredients'],
        type: 'object',
        properties: {
            user_uid: {
                type: 'string',
                minimum: 5,
            },
            _id: {
                type: 'string',
                minimum: 5,
            },
            allergy: {
                type: 'string',
                minimum: 5,
                maximum: 255,
            },
            ingredients: {
                type: 'string',
                minimum: 5,
                maximum: 255,
            },
            date: {
                type: 'string',
                format: 'date-time'
                // default: Date.now,
            },
        }
    }


    describe('/all allergy check', () => {
        it('it should check all allergy', (done) => {
            chai.request('http://localhost:3000')
                .get('/api/allergies')
                .set({
                    "Authorization": `Bearer ${token}`
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].should.be.a('object');
                    res.body[0].should.be.jsonSchema(allAllergySchema)
                    done();
                });
        });
    });

    describe('/allergy check', () => {
        it('it should check particular allergy check', (done) => {
            chai.request('http://localhost:3000')
                .get('/api/allergies/5f812e338729023cc0bb223c')
                .set({
                    "Authorization": `Bearer ${token}`
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.be.jsonSchema(allAllergySchema)
                    done();
                });
        });
    });
})