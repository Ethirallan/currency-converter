import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor() {}

  use(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization;

    if (token != null && token != '' && token.replace('Bearer ', '') == process.env.API_KEY) {
      next();
    } else {
      this.accessDenied(req.url, res);
    }
  }

  private accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Access Denied'
    });
  }
}
