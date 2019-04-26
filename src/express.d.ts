import {Request} from 'express';
import { Location } from './models/population.model';
import { User } from './models/user.model';

interface IRequest extends Request {
  location?: Location;
  user?: User;
  email?: string
}