import DBConfig from './app_configurations/db_config';
import ServerSetup from './server';

const dbConfig = new DBConfig();
const serverSetup = new ServerSetup();

dbConfig.dbConnection().then( ()=> {
  serverSetup.serverSetup();
})
