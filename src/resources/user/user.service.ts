import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindAllResponse } from 'src/shared/types';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name);
  tableName = 'users';
  constructor(@InjectRepository(User) readonly userRepository: Repository<User>) {}

  async findAll(): Promise<FindAllResponse<User>> {
    const itemsPromise = this.userRepository.query(`SELECT * FROM ${this.tableName}`);
    const countPromise = this.userRepository.query(`SELECT COUNT(*) FROM ${this.tableName}`);
    const [items, [count]] = await Promise.all([itemsPromise, countPromise]);
    this.logger.log(`Items count: ${count.count}`);

    return { items, count: count.count };
  }
  async getByName(username: string): Promise<User> {
    const [user] = await this.userRepository.query(`SELECT * FROM ${this.tableName} WHERE name = $1`, [username]);
    return user;
  }

  async findOne(id: number): Promise<User> {
    const [item] = await this.userRepository.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
    if (!item) {
      this.logger.debug('Item not found', id);
      throw new NotFoundException({ message: `Item with id: ${id} not found` });
    }
    this.logger.log(`Item found`, item);
    return item;
  }

  async update(id: number, name: string) {
    const user = await this.findOne(id);
    await this.userRepository.query(`UPDATE ${this.tableName} SET name = $1 WHERE id = $2`, [name, user.id]);
    this.logger.log('Successfully updated');
  }
}
