import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';

import ApiDocumentation from './app_configurations/api_documentation';
import { Utilities } from './utilities/utilities';
import config from './app_configurations/config';

import UserAuthenticationRoutes from './routes/user_authentication.router';



/**
 * Setup express server
 */

export default class ServerSetup{
  app = express();
  private apiDocumentation: ApiDocumentation;
  private userAuthenticationRoutes: UserAuthenticationRoutes;

  constructor(){
    this.apiDocumentation = new ApiDocumentation();
    this.userAuthenticationRoutes = new UserAuthenticationRoutes();
  }

  serverSetup(){
    const port = config.PORT;

    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.get( '/', function ( req, res )
    {
      const hostUrl = `${req.protocol}://${Utilities.getHostUrl(req, port)}`
      res.send( `Welcome to the Population Management System API. You can access the API documentation at <a href="${hostUrl}/api-docs/">here</a>` );
    })
    this.app.use(this.apiDocumentation.swaggerDocumentation());
    this.app.use(this.userAuthenticationRoutes.userSignUp());
    this.app.listen( port, function ()
    {
      console.log( 'Running on port: ' + port );
    });
  }

}