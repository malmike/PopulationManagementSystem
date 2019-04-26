import * as jwt from 'jsonwebtoken';
import config from '../app_configurations/config';
import GetUser from './getUser.middleware';
import { Response, NextFunction} from 'express';
import { IRequest } from '../express';

export default class UserAuthentication{
  userAuth(req: IRequest, res: Response, next: NextFunction){
    var token = req.headers['x-access-token'];
    if(token){
      jwt.verify(token.toString(), config.APP_SECRET, (err, decoded) => {
        if(err){
          const message = {
            message: 'Failed to authenticate token',
          }
          res.status(401).send(message);
        }else{
          req.email = decoded['email'];
          new GetUser().getUser(req, res, next);
        }
      })
    }else{
      const message = {
        message: 'Token not provided',
      }
      res.status(401).send(message);
    }
  }
}