import * as jwt from 'jsonwebtoken';
import config from '../app_configurations/config';
import {Request, Response, NextFunction} from 'express';
import { UserModel } from '../models/user.model';
import { IRequest } from '../express';

export default class GetUser{

  async getUser(req: IRequest, res: Response, next: NextFunction){
    await UserModel.findOne({
      email: req.email
    }, (err, user) => {
      if(err){
        res.status(500).send(err);
      }
      if(user){
        req.user = user;
        next()
      }else{
        const message=`No user found with the phone number ${req.body.email}`
        res.status(401).send({message});
      }
    })
  }

}