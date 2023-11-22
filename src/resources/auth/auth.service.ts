import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt/jwt.interface';
import { JwtLocalService } from './jwt/jwt.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtLocalService,
    private readonly userService: UserService,
  ) {}

  async login(username: string): Promise<{ access_token: string }> {
    const user = await this.userService.getByName(username);
    if (!user) {
      throw new UnauthorizedException("User doesn't exist");
    }
    const payload: JwtPayload = { userId: user.id, name: user.name, role: user.role };
    const access_token = await this.jwtService.generateToken(payload);
    return { access_token };
  }

  verifyToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyToken(token);
  }

  async validateUserByName(username: string) {
    return this.userService.getByName(username);
  }
}
