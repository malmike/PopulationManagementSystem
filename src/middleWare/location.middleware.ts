import { Response, NextFunction} from 'express';
import { LocationModel } from '../models/population.model';
import { IRequest } from '../express';

export default class GetLocation{

  async getLocation(req: IRequest, res: Response, next: NextFunction){
    const name = req.query.name;
    await LocationModel.findOne({
      name: name
    }, (err, location) => {
      if(err){
        res.status(500).send(err);
      }
      if(location){
        req.location = location;
        next()
      }else{
        const message=`The location ${name} can not be found`
        res.status(404).send({message});
      }
    })
  }

}