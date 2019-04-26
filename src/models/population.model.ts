import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *  AddPopulationSize:
 *    type: "object"
 *    properties:
 *      males:
 *        type: "integer"
 *      females:
 *        type: "integer"
 *
 *  PopulationSize:
 *    type: "object"
 *    properties:
 *      males:
 *        type: "integer"
 *      females:
 *        type: "integer"
 *      totalSize:
 *        type: "integer"
 */
export interface PopulationSize extends mongoose.Document{
  males: number;
  females: number;
  totalSize?: number;
}

const populationSizeSchema = new Schema(
  {
    males: {
      type: Number
    },
    females: {
      type: Number
    },
    totalSize: {
      type: Number
    }
  }
)

/**
 * @swagger
 * definition:
 *   AddLocation:
 *     type: "object"
 *     properties:
 *       name:
 *         type: "string"
 *
 *   SubLocation:
 *     type: "object"
 *     properties:
 *       sub_location_name:
 *         type: "string"
 *
 *   Location:
 *     type: "object"
 *     properties:
 *       name:
 *         type: "string"
 *       populationSize:
 *         $ref: "#/definitions/PopulationSize"
 *       subLocation:
 *         type: "array"
 *         items:
 *           type: "string"
 */
export interface Location extends mongoose.Document {
  name: string,
  subLocation?: Array<string>,
  populationSize?: PopulationSize;
}

const locationSchema = new Schema(
  {
    name:{
      type: String,
      unique: true
    },
    populationSize:{
      type: populationSizeSchema,
      required: false
    },
    subLocation: [{
      type: String,
      ref: 'location',
    }],
  }
)

mongoose.set('useCreateIndex', true);
export const PopulationSizeModel = mongoose.model<PopulationSize>('populationSize', populationSizeSchema);
export const LocationModel = mongoose.model<Location>('location', locationSchema);
