import { expect } from 'chai';
import agent from '../tests/setup_tests';
import { LocationModel } from '../models/population.model';
import { SharedTestProperties } from '../tests/shared_test_properties';
import { UserModel } from '../models/user.model';

describe('PopulationSizeRoutes', function () {
  let token: string;
  beforeEach(async () => {
    await UserModel.deleteMany({}, ()=> {});
    token = await SharedTestProperties.addTestUser();
  })
  describe('addPopulationSize', ()=> {
    beforeEach(async ()=>{
      await LocationModel.deleteMany({}, ()=> {});
    })
    it('should not add population if location does not exist', async () => {
      const name = SharedTestProperties.testLocation.name;
      const response = await agent.post(`/addPopulationSize?name=${name}`)
        .set('x-access-token', token)
        .send({
          "males": 10,
          "females": 10
        });
      expect(response.status).to.equal(404)
      expect(JSON.parse(response.text).message).to.equal("The location Kireka can not be found");
    });

    it('should total up population if location exist', async () => {
      const name = await SharedTestProperties.addTestLocation();
      const response = await agent.post(`/addPopulationSize?name=${name}`)
        .set('x-access-token', token)
        .send({
          "males": 10,
          "females": 10
        });
      expect(response.status).to.equal(201)
      expect(JSON.parse(response.text).totalSize).to.equal(20);
    });
  })

  describe('getPopulationSize', ()=> {
    beforeEach(async ()=>{
      await LocationModel.deleteMany({}, ()=> {});
    })
    it('should get population size', async () => {
      const name = await SharedTestProperties.addTestLocationWithPopulation();
      const response = await agent.get(`/getPopulationSize?name=${name}`)
        .set('x-access-token', token);
      expect(response.status).to.equal(200)
      expect(JSON.parse(response.text)).to.contain.keys('_id', 'males', 'females', 'totalSize');
    });
  })

  describe('updatePopulationSize', ()=> {
    beforeEach(async ()=>{
      await LocationModel.deleteMany({}, ()=> {});
    })
    it('should update population size', async () => {
      const name = await SharedTestProperties.addTestLocationWithPopulation();
      const response =await agent.put(`/updatePopulationSize?name=${name}`)
        .set('x-access-token', token)
        .send({
          "males": 20,
        });
      expect(response.status).to.equal(201)
      expect(JSON.parse(response.text).males).to.equal(20);
      expect(JSON.parse(response.text).totalSize).to.equal(30);
    });
  })
});