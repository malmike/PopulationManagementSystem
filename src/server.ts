import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';



/**
 * Setup express server
 */

export default class ServerSetup{
  app = express();

  constructor(){
  }

  serverSetup(){
    const port = config.PORT;

    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.get( '/', function ( req, res )
    {
      res.send( `Welcome to the Population Management System API.` );
    })
    this.app.listen( port, function ()
    {
      console.log( 'Running on port: ' + port );
    });
  }

}