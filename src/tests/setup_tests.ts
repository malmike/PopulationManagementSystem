import * as request from 'supertest';
import DBConfig from '../app_configurations/db_config';
import ServerSetup from '../server';

class SetupTests{
  private serverSetup:ServerSetup;
  private dbConfig: DBConfig;
  constructor(){
    this.serverSetup = new ServerSetup();
    this.dbConfig = new DBConfig();
  }

  setupTestServer(){
    this.dbConfig.dbConnection();
    this.serverSetup.serverSetup();
    const app = this.serverSetup.app;
    return request(app);
  }
}

const setupTests = new SetupTests();
const agent = setupTests.setupTestServer();
export default agent;