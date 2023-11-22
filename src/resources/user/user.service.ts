import { Injectable } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  tableName = 'users';
  constructor(@InjectRepository(User) readonly userRepository: Repository<User>) {}

  async getByName(username: string): Promise<User> {
    const [user] = await this.userRepository.query(`SELECT * FROM ${this.tableName} WHERE name = $1`, [username]);
    return user;
  }
}
