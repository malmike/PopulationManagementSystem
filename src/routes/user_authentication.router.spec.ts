import { expect } from 'chai';
import agent from '../tests/setup_tests';
import { UserModel } from '../models/user.model';
import { SharedTestProperties } from '../tests/shared_test_properties';

describe('UserAuthenticationRoutes', function () {
  beforeEach(async ()=>{
    await UserModel.deleteMany({}, ()=> {});
  })

  describe('user sign up', ()=> {
    it('should sign up new user', (done) => {
      const userPost = SharedTestProperties.testUser;
      agent.post('/registerUser')
        .send(userPost)
        .expect(201)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body.user).to.have.property('_id');
          expect(response.body.user.password).to.equal(undefined);
          expect(response.body).to.have.property('token');
          done();
        })
    });
  })

  describe('user sign in', () => {
    let token = '';
    beforeEach(async ()=> {
      token = await SharedTestProperties.addTestUser();
    })

    it('should sign in existing user', (done) => {
      const userPost = SharedTestProperties.testUser;
      agent.post('/registerUser')
        .send(userPost)
        .expect(201)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body).to.have.property('token');
          expect(response.body.user.password).to.equal(undefined);
          done();
        })
    });

    it('should fail to sign in user with incorrect password', (done) => {
      const userPost = SharedTestProperties.testUserIncorrectPassword;
      agent.post('/registerUser')
        .send(userPost)
        .expect(401)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body.message).to.equal('The email malmike21@gmail.com already exists, please enter the right password');
          done();
        })
    });

    it('should get signed in user get user', (done) => {
      agent.get('/getUser')
        .set('x-access-token', token)
        .expect(200)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body.password).to.equal(undefined);
          expect(response.body.email).to.equal('malmike21@gmail.com');
          done()
        })
    })
  })
});