# Unit Testing Using Chai and Mocha
## _Would you like to have Chai with Mocha.........Trust me it's tasty😋😋_

[__Mocha__](https://mochajs.org/) is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases.

[__Chai__](https://www.chaijs.com/) is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework.

[__Chai Http__](https://www.chaijs.com/plugins/chai-http/) is HTTP integration testing with Chai assertions.

[__chai-json-schema__](https://www.chaijs.com/plugins/chai-json-schema/) is a plugin with assertions to validate values against JSON Schema v4.

## Features

- Mocha and Chai are two JavaScript frameworks commonly used together for unit testing
- Mocha is a testing framework that provides functions that are executed according in a specific order, and that logs their results to the terminal window)
- The base component of test cases are assertions. Assertions are tied to particular values (whereas test cases are descriptions of behavior) and they will fail if the expected value does not match the actual value.
- Every assertion in a test case must be met in order for the test case to pass.
- Chai is an assertion library that is often used alongside Mocha. It provides functions and methods that help you compare the output of a certain test with its expected value.

## For testing RestAPIs we need chai Http
### Feature of Chai Http
- Integration test request composition
- Test http apps or external services
- Assertions for common http tasks
- Chai expect and should interfaces

## How to implement Chai and Mocha
### 1. Install Chai and mocha as a dev dependency to your project.

```sh
$ npm install --save-dev chai
$ npm install --save-dev mocha
$ npm install --save-dev chai-http
$ npm install chai-json-schema
```
### 2. Inside Package.json scripts change test to "mocha || true"
```sh
"scripts": {
    "test": "mocha || true"
  }
```
### 3. Create a folder named test inside root
-Create a new file, can be named anything.😝😝

### 4. Inside newly created folder initialize chai
```sh
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);
chai.use(require('chai-json-schema'));
```
__Now You can create your own test case taking help from the documentation of chai and chai http__

__Example__
```sh
describe('Description', () => {
    describe('/Describe the test', () => {
        it('it should return server running', (done) => {
            chai.request('http://localhost:3000') //server address
                .get('/')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.body.should.have.property('message').eql('Palatio server is running....')
                    done();
                });
        });
    });
})
```
### 5. Run the Test
__Run command Npm test__
```sh
npm test

> authentication@1.0.0 test D:\NODEJS\platio_backend
> mocha || true

  Palatio
    /Check server
      √ it should return server running (40ms)
    /Register
      √ it should register the user (372ms)
    /Login
      √ it should login the user with credential (607ms)
    /JWT check
      √ it should check authenticity of JWT token
    /all allergy check
      √ it should check all allergy (294ms)
    /allergy check
      √ it should check particular allergy check (267ms)


  6 passing (2s)
```

# Thanks a lot 
## Github Repo : [https://github.com/ArpitSharma2800/Unit_testing_nodejs](https://github.com/ArpitSharma2800/Unit_testing_nodejs)
