import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import {UserModel, User} from '../models/user.model';
import config from '../app_configurations/config';
import UserAuthentication from '../middleWare/user_authentication.middleware';
import { IRequest } from '../express';
import * as bcrypt from 'bcrypt';

export default class UserAuthenticationRoutes{
  private router: express.Router;

  constructor(){
    this.router = express.Router();
  }

  /**
   * @swagger
   * /registerUser:
   *  post:
   *    tags:
   *      - "User"
   *    description: "Register new user or sign in existing user"
   *    consumes:
   *      - "application/json"
   *    produces:
   *       - "application/json"
   *    parameters:
   *    - in: "body"
   *      name: "body"
   *      description: "Register/ Sign In user"
   *      required: true
   *      schema:
   *        $ref: "#/definitions/User"
   *    responses:
   *      201:
   *        description: "successful operation"
   *        schema:
   *          $ref: "#/definitions/SignedInUser"
   *      500:
   *        description: "server error"
   *      400:
   *        description: "Email already attached to different account"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *
   */
  userSignUp(): express.Router{
    this.router.post('/registerUser', async (req, res) => {
      const userData = req.body as User;
      UserModel.findOne({
        email: userData.email
      }, async (err, user) => {
        if(err){
          res.status(500).send(err);
        }
        if(!user){
          userData.password = bcrypt.hashSync(userData.password, config.SALT_ROUNDS);
          const user: User = new UserModel(userData);
          await user.save(err=> {
            if(err){
             res.status(500).send(err);
            }else{
              this.userAutenticationResponse(res, user);
            }
          });
        }else{
          if(!bcrypt.compareSync(userData.password, user.password)){
            const message = `The email ${user.email} already exists, please enter the right password`;
            res.status(401).send({message});
          }else{
            this.userAutenticationResponse(res, user);
          }
        }
      })

    })
    return this.router;
  }

  private userAutenticationResponse(res, user: User){
    user.password = undefined;
    const token = jwt.sign({_id: user._id, email: user.email}, config.APP_SECRET)
    const message = {
      user: user,
      token: token
    }
    res.status(201);
    res.send(message);
  }

  getUser(): express.Router{
    this.router.use(new UserAuthentication().userAuth);
    this.router.get('/getUser', async (req: IRequest, res) => {
      req.user.password = undefined;
      res.status(200).send(req.user);
    })
    return this.router;
  }
}