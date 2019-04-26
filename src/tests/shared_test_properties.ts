import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { LocationModel, PopulationSizeModel } from '../models/population.model';
import config from '../app_configurations/config';
import { UserModel } from '../models/user.model';


export class SharedTestProperties{
  static testUser = {email: 'malmike21@gmail.com', password: '12345'};
  static testUserIncorrectPassword = {email: 'malmike21@gmail.com', password: 'qwerty'};
  static testLocation = {name: 'Kireka'};
  static testLocation2 = {name: 'Najerra'};
  static testPopulation = {
    males: 10,
    females: 10,
    totalSize: 20
  }
  constructor(){}

  static async addTestUser(): Promise<string>{
    const user = new UserModel(this.testUser);
    user.password = bcrypt.hashSync(user.password, config.SALT_ROUNDS)
    await user.save();
    return jwt.sign({_id: user._id, email: user.email}, config.APP_SECRET)
  }

  static async addTestLocation(): Promise<string>{
    const location = new LocationModel(this.testLocation);
    await location.save();
    return location.name;
  }

  static async addTestLocation2(): Promise<string>{
    const location = new LocationModel(this.testLocation2);
    await location.save();
    return location.name;
  }

  static async addTestLocationWithPopulation(): Promise<string>{
    const location = new LocationModel(this.testLocation);
    location.populationSize = new PopulationSizeModel(this.testPopulation);
    await location.save();
    return location.name;
  }

  static async addTestLocationWithSublocation(){
    const location2 = new LocationModel(this.testLocation2);
    await location2.save();
    const testLocation = {...this.testLocation};
    testLocation["subLocation"] = [location2.name];
    const location = new LocationModel(testLocation);
    await location.save();
  }
}