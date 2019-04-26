import { expect } from 'chai';
import agent from '../tests/setup_tests';
import { LocationModel } from '../models/population.model';
import { SharedTestProperties } from '../tests/shared_test_properties';
import { UserModel } from '../models/user.model';

describe ('LocationRoutes', function () {
  let token: string;
  beforeEach(async () => {
    await UserModel.deleteMany({}, ()=> {});
    token = await SharedTestProperties.addTestUser();
  })
  describe('addLocation', ()=> {
    beforeEach(async ()=>{
      await LocationModel.deleteMany({}, ()=> {});
    })
    it('should add new location', (done) => {
      const testLocation = SharedTestProperties.testLocation;
      agent.post('/addLocation')
        .send(testLocation)
        .set('x-access-token', token)
        .expect(201)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body).to.have.property('_id');
          done();
        })
    });
    it('should not add location if it already exist', (done) => {
      SharedTestProperties.addTestLocation();
      const testLocation = SharedTestProperties.testLocation;
      agent.post('/addLocation')
        .send(testLocation)
        .set('x-access-token', token)
        .expect(409)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body.message).to.equal('The location Kireka already exists');
          done();
        })
    });
  })

  describe('getLocations', ()=> {
    beforeEach(async ()=>{
      await LocationModel.deleteMany({}, ()=> {});
    })
    it('should get locations', (done) => {
      SharedTestProperties.addTestLocation();
      agent.get('/getLocations')
        .set('x-access-token', token)
        .expect(200)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body.length).to.equal(1);
          done();
        })
    });
  })

  describe('getLocationRoute', ()=> {
    beforeEach(async ()=>{
      await LocationModel.deleteMany({}, ()=> {});
    })
    it('should get locations', async () => {
      const name = await SharedTestProperties.addTestLocation();
      const response = await agent.get(`/getLocation?name=${name}`)
        .set('x-access-token', token);
      expect(response.status).to.equal(200);
      expect(JSON.parse(response.text)).to.contain.keys('_id', 'name', 'subLocation');
    });
  })

  describe('addSubLocation', ()=> {
    beforeEach(async ()=>{
      await LocationModel.deleteMany({}, ()=> {});
    })
    it('should add new sub location', async () => {
      const name = await SharedTestProperties.addTestLocation();
      const sublocation = await SharedTestProperties.addTestLocation2();
      const response = await agent.put(`/addSubLocation?name=${name}`)
        .set('x-access-token', token)
        .send({
          sub_location_name: sublocation
        });
      expect(response.status).to.equal(201);
      expect(JSON.parse(response.text).subLocation).to.eql([sublocation]);
    });

    it('should not add location if it already exist', async () => {
      await SharedTestProperties.addTestLocationWithSublocation();
      const name = SharedTestProperties.testLocation.name;
      const sublocation = SharedTestProperties.testLocation2.name;
      const response = await agent.put(`/addSubLocation?name=${name}`)
        .set('x-access-token', token)
        .send({
          sub_location_name: sublocation
        });
      expect(response.status).to.equal(409);
      expect(JSON.parse(response.text).message).to.equal("Location Kireka already contains a sublocation Najerra");
    });
  })

  describe('deleteSubLocation', ()=> {
    beforeEach(async ()=>{
      await LocationModel.deleteMany({}, ()=> {});
    })
    it('should delete sublocation', async () => {
      await SharedTestProperties.addTestLocationWithSublocation();
      const name = SharedTestProperties.testLocation.name;
      const sublocation = SharedTestProperties.testLocation2.name;
      const response = await agent.put(`/deleteSubLocation?name=${name}`)
        .set('x-access-token', token)
        .send({
          sub_location_name: sublocation
        });
      expect(response.status).to.equal(201);
      expect(JSON.parse(response.text).subLocation).to.eql([]);
    });

    it('should not delete sub location if it does not exist', async () => {
      const name = await SharedTestProperties.addTestLocation();
      const sublocation = SharedTestProperties.testLocation2.name;
      const response = await agent.put(`/deleteSubLocation?name=${name}`)
        .set('x-access-token', token)
        .send({
          sub_location_name: sublocation
        });
      expect(response.status).to.equal(404);
      expect(JSON.parse(response.text).message).to.equal("The sublocation Najerra does not exist");
    });
  })
});