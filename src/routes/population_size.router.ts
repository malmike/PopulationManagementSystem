import * as express from 'express';
import {PopulationSize, PopulationSizeModel, } from '../models/population.model';
import GetLocation from '../middleWare/location.middleware';
import { IRequest } from '../express';
import UserAuthentication from '../middleWare/user_authentication.middleware';

export default class PopulationSizeRoutes{
  private router: express.Router;
  private getLocation: GetLocation;

  constructor(){
    this.router = express.Router();
    this.getLocation = new GetLocation();
  }

  /**
   * @swagger
   * /addPopulationSize:
   *  post:
   *    tags:
   *      - "PopulationSize"
   *    summary: "Add population size"
   *    description: "Add population size"
   *    consumes:
   *      - "application/json"
   *    produces:
   *       - "application/json"
   *    parameters:
   *    - name: "name"
   *      in: "query"
   *      type: "string"
   *      description: "Name of location whose details you what to get"
   *      required: true
   *    - in: "body"
   *      name: "body"
   *      description: "Add location"
   *      required: true
   *      schema:
   *        $ref: "#/definitions/AddPopulationSize"
   *    responses:
   *      201:
   *        description: "successful operation"
   *        schema:
   *          $ref: "#/definitions/PopulationSize"
   *      500:
   *        description: "server error"
   *      401:
   *        description: "Unathorized access"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *      404:
   *        description: "Data does not exist"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *    security:
   *      - api_key: []
   */
  addPopulationSize(): express.Router{
    this.router.use(new UserAuthentication().userAuth);
    this.router.use(this.getLocation.getLocation);
    this.router.post('/addPopulationSize', async (req: IRequest, res) => {
      const populationSize = req.body as PopulationSize
      populationSize.totalSize = populationSize.males + populationSize.females;
      const population = new PopulationSizeModel(populationSize);
      req.location.populationSize = population;
      req.location.save(err => {
        if(err){
          res.status(500).send(err);
        }else{
          res.status(201).send(population);
        }
      })
    })
    return this.router;
  }

  /**
   * @swagger
   * /getPopulationSize:
   *  get:
   *    tags:
   *      - "PopulationSize"
   *    summary: "Get population size"
   *    description: "Get population size"
   *    consumes:
   *      - "application/json"
   *    produces:
   *       - "application/json"
   *    parameters:
   *    - name: "name"
   *      in: "query"
   *      type: "string"
   *      description: "Name of location whose details you what to get"
   *      required: true
   *    responses:
   *      200:
   *        description: "successful operation"
   *        schema:
   *          $ref: "#/definitions/PopulationSize"
   *      500:
   *        description: "server error"
   *      401:
   *        description: "Unathorized access"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *      404:
   *        description: "Data does not exist"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *    security:
   *      - api_key: []
   */
  getPopulationSize(): express.Router{
    this.router.use(new UserAuthentication().userAuth);
    this.router.use(this.getLocation.getLocation);
    this.router.get('/getPopulationSize', async (req: IRequest, res) => {
      res.status(200).send(req.location.populationSize)
    })
    return this.router;
  }

  /**
   * @swagger
   * /updatePopulationSize:
   *  put:
   *    tags:
   *      - "PopulationSize"
   *    summary: "Update population size"
   *    description: "Update population size"
   *    consumes:
   *      - "application/json"
   *    produces:
   *       - "application/json"
   *    parameters:
   *    - name: "name"
   *      in: "query"
   *      type: "string"
   *      description: "Name of location whose details you what to get"
   *      required: true
   *    - in: "body"
   *      name: "body"
   *      description: "Update population size"
   *      required: true
   *      schema:
   *        $ref: "#/definitions/AddPopulationSize"
   *    responses:
   *      201:
   *        description: "successful operation"
   *        schema:
   *          $ref: "#/definitions/PopulationSize"
   *      500:
   *        description: "server error"
   *      401:
   *        description: "Unathorized access"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *      404:
   *        description: "Data does not exist"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *    security:
   *      - api_key: []
   */
  updatePopulationSize(): express.Router{
    this.router.use(new UserAuthentication().userAuth);
    this.router.use(this.getLocation.getLocation);
    this.router.put('/updatePopulationSize', async (req: IRequest, res) => {
      const newPopulationSize = req.body as PopulationSize
      req.location.populationSize.females = newPopulationSize.females ? newPopulationSize.females : req.location.populationSize.females;
      req.location.populationSize.males = newPopulationSize.males ? newPopulationSize.males : req.location.populationSize.males;
      req.location.populationSize.totalSize = req.location.populationSize.males + req.location.populationSize.females;
      req.location.save(err => {
        if(err){
          res.status(500).send(err);
        }else{
          res.status(201).send(req.location.populationSize);
        }
      })
    })
    return this.router;
  }
}