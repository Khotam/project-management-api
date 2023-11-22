// jwt.middleware.ts

import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const [, token] = authorizationHeader.split(' ');
      try {
        const decodedToken = await this.authService.verifyToken(token);
        const user = await this.authService.validateUserByName(decodedToken.name);
        if (user) {
          req.user = user;
        }
      } catch (error) {
        throw new UnauthorizedException('Token is not valid');
      }
    }

    next();
  }
}
