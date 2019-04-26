import * as express from 'express';
import * as mongoose from 'mongoose';
import {LocationModel, Location, PopulationSizeModel} from '../models/population.model';
import GetLocation from '../middleWare/location.middleware';
import { IRequest } from '../express';
import UserAuthentication from '../middleWare/user_authentication.middleware';

export default class LocationRoutes{
  private router: express.Router;
  private getLocation: GetLocation;
  constructor(){
    this.router = express.Router();
    this.getLocation = new GetLocation();
  }

  /**
   * @swagger
   * /addLocation:
   *  post:
   *    tags:
   *      - "Location"
   *    description: "Add location"
   *    consumes:
   *      - "application/json"
   *    produces:
   *       - "application/json"
   *    parameters:
   *    - in: "body"
   *      name: "body"
   *      description: "Add location"
   *      required: true
   *      schema:
   *        $ref: "#/definitions/AddLocation"
   *    responses:
   *      201:
   *        description: "successful operation"
   *        schema:
   *          $ref: "#/definitions/AddLocation"
   *      500:
   *        description: "server error"
   *      401:
   *        description: "Unathorized access"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *    security:
   *      - api_key: []
   */

  addLocation(): express.Router{
    this.router.use(new UserAuthentication().userAuth);
    this.router.post('/addLocation', async (req, res) => {
      const locationData = req.body as Location;
      const location: Location = new LocationModel(locationData);
      await location.save(err => {
        if(err){
          err.code === 11000?
            res.status(409).send({
              message: `The location ${locationData.name} already exists`
            }):
            res.status(500).send(err);
        }else{
          res.status(201).send(location);
        }
      })
    })
    return this.router;
  }

  /**
   * @swagger
   * /getLocations:
   *  get:
   *    tags:
   *      - "Location"
   *    description: "Get all locations"
   *    produces:
   *      - "application/json"
   *    responses:
   *      200:
   *        description: "Locations successfully retrieved"
   *        schema:
   *          type: "array"
   *          items:
   *            $ref: "#/definitions/Location"
   *      401:
   *        description: "Invalid token"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *      500:
   *        description: "server error"
   *    security:
   *    - api_key: []
   */

  getLocations(): express.Router{
    this.router.use(new UserAuthentication().userAuth);
    this.router.get('/getLocations', async (req, res) => {
      await LocationModel.find((err, values)=> {
        if(err) res.status(500).send(err)
        else res.json(values);
      })
    })
    return this.router;
  }

  /**
   * @swagger
   * /getLocation:
   *  get:
   *    tags:
   *      - "Location"
   *    description: "Get all locations"
   *    produces:
   *      - "application/json"
   *    parameters:
   *    - name: "name"
   *      in: "query"
   *      type: "string"
   *      description: "Name of location whose details you what to get"
   *      required: true
   *    responses:
   *      200:
   *        description: "Locations successfully retrieved"
   *        schema:
   *          type: "array"
   *          items:
   *            $ref: "#/definitions/Location"
   *      401:
   *        description: "Invalid token"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *      500:
   *        description: "server error"
   *    security:
   *    - api_key: []
   */
  getLocationRoute(): express.Router{
    this.router.use(new UserAuthentication().userAuth);
    this.router.use(this.getLocation.getLocation);
    this.router.get('/getLocation', async (req:IRequest, res) => {
      res.status(200).send(req.location)
    })
    return this.router;
  }

  /**
   * @swagger
   * /addSubLocation:
   *  put:
   *    tags:
   *      - "Location"
   *    description: "Add sub location"
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
   *        $ref: "#/definitions/SubLocation"
   *    responses:
   *      201:
   *        description: "successful operation"
   *        schema:
   *          $ref: "#/definitions/Location"
   *      500:
   *        description: "server error"
   *      401:
   *        description: "Unathorized access"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *      409:
   *        description: "Data conflict"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *    security:
   *      - api_key: []
   */
  addSubLocation(): express.Router{
    this.router.use(new UserAuthentication().userAuth);
    this.router.use(this.getLocation.getLocation);
    this.router.put('/addSubLocation', async (req: IRequest, res) => {
      const sub_location_name = req.body.sub_location_name;
      if(req.location.name === sub_location_name){
        const message = "Location cannot be a sublocation of its self"
        res.status(400).send({message});
      }else if(req.location.subLocation.includes(sub_location_name)){
        const message = `Location ${req.location.name} already contains a sublocation ${sub_location_name}`
        res.status(409).send({message});
      }
      else{
        await LocationModel.findOne({
          name: sub_location_name
        }, async (err, location) => {
          if(err){
            res.status(500).send(err);
          }else if(!location){
            const message = `The location ${sub_location_name} provided as a sub location can not be found`;
            res.status(404).send({message});
          }
          else if(
            location.subLocation.includes(req.location.name)
          ){
            const message = `Location ${req.location.name} is a sublocation of${sub_location_name}`;
            res.status(400).send({message});
          }
          else{
            req.location.subLocation.push(location.name);
            await req.location.save(err => {
              if(err){
                res.status(500).send(err);
              }else{
                res.status(201).send(req.location);
              }
            });
          }
        })
      }
    })
    return this.router;
  }

  /**
   * @swagger
   * /deleteSubLocation:
   *  put:
   *    tags:
   *      - "Location"
   *    description: "Add sub location"
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
   *        $ref: "#/definitions/SubLocation"
   *    responses:
   *      201:
   *        description: "successful operation"
   *        schema:
   *          $ref: "#/definitions/Location"
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
  deleteSubLocation(): express.Router{
    this.router.use(new UserAuthentication().userAuth);
    this.router.use(this.getLocation.getLocation);
    this.router.put('/deleteSubLocation', async(req: IRequest, res) => {
      const sub_location_name = req.body.sub_location_name;
      const index = req.location.subLocation.indexOf(sub_location_name);
      if(index > -1){
        req.location.subLocation.splice(index, 1);
        req.location.save(err => {
          if(err){
            res.status(500).send(err);
          }else{
            res.status(201).send(req.location);
          }
        })
      }else{
        const message = `The sublocation ${sub_location_name} does not exist`;
        res.status(404).send({message});
      }
    })
    return this.router;
  }
}