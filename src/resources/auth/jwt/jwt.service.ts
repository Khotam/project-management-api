import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtLocalService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  verifyToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, { secret: this.configService.get('jwtSecretKey') });
  }
}
