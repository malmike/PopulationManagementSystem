import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;


/**
 * @swagger
 * definition:
 *   SignedInUser:
 *      type: "object"
 *      properties:
 *        user:
 *          $ref: "#/definitions/User"
 *        token:
 *          type: "string"
 *
 *   User:
 *     type: "object"
 *     required:
 *     - "password"
 *     - "email"
 *     properties:
 *       email:
 *         type: "string"
 *       password:
 *         type: "string"
 *
 *   ResponseMessage:
 *     type: "object"
 *     properties:
 *       message:
 *         type: "string"
 *
 */
export interface User extends mongoose.Document{
  email: string;
  password?: string;
}

const userSchema = new Schema(
  {
    email: {
      type: String
    },
    password: {
      type: String,
      unique: true,
    },
  }
)

mongoose.set('useCreateIndex', true);
export const UserModel = mongoose.model<User>('user', userSchema);
