let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

describe('Palatio', () => {
    describe('/Check server', () => {
        it('it should return server running', (done) => {
            chai.request('http://localhost:3000')
                .get('/')
                .end((err, res) => {
                    console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    expect(res.body.message).to.equal('Palatio server is running....');
                    // res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
})