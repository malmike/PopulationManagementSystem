import * as express from 'express';

export namespace Utilities{
  export function getHostUrl(req: express.Request, port: number){
    return `${req.hostname}:${port}`;
  }
}
