import { Injectable, Inject } from '../container';
import { DatabaseService, IDatabase } from './database.service';

export interface IUserService {
  getUsers(): any[];
  getUserById(id: number): any;
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    private database: DatabaseService
  ) {
    console.log('👤 UserService created');
  }

  getUsers(): any[] {
    return this.database.query('SELECT * FROM users');
  }

  getUserById(id: number): any {
    const users = this.database.query(`SELECT * FROM users WHERE id = ${id}`);
    return users[0] || null;
  }
}