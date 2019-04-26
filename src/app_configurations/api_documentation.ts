import * as express from 'express';
import * as swaggerJSDoc from 'swagger-jsdoc';

import { Utilities } from '../utilities/utilities';
import config from './config';

export default class ApiDocumentation{
  /**
   * Swagger specification
   */
  private swagger_options = {
    definition: {
      swagger: '2.0',
      info: {
        title: 'Population Management System API',
        version: '1.0.0',
        description: 'Population Management System API',
      },
      host: '',
      basePath: '/',
    },
    apis: ['./**/*.router.js', './**/*.router.ts', './**/*.middleware.js', './**/*.middleware.ts', './**/*.model.js', './**/*.model.ts'],
  };

  private router: express.Router;

  constructor(){
    this.router = express.Router();
  }

  private swaggerSpec(req) {
    this.swagger_options.definition.host = Utilities.getHostUrl(req, config.PORT);
    return swaggerJSDoc(this.swagger_options);
  }

  swaggerDocumentation(): express.Router{
    this.router.get('/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(this.swaggerSpec(req));
    })
    return this.router;
  }
}