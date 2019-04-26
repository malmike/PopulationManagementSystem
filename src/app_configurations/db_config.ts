import * as mongoose from 'mongoose';
import config from './config';

export default class DBConfig{
  private connString = config.DB_URI;
  private dbConnectionOptions: mongoose.ConnectionOptions;

  constructor(){
    this.dbConnectionOptions = {
      useNewUrlParser: true
    }
  }

  async dbConnection(){
    const setDebug = (config.DB_DEBUG_OPTION === "true");
    try{
      const db = await mongoose.connect(this.connString, this.dbConnectionOptions);
      mongoose.set('debug', setDebug);
    }
    catch(error){
      throw(`Could not connect to mongo DB: ${error}`);
    }
  }
}

