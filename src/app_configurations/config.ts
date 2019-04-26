import * as dotenv from 'dotenv';

dotenv.config()

const config = {
  DB_URI: process.env.DB_URI,
  PORT: parseInt(process.env.PORT) | 1337,
  DB_DEBUG_OPTION: process.env.DB_DEBUG_OPTION,
  APP_SECRET: process.env.APP_SECRET,
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS)
}

export default config;