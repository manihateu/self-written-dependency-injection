import { Injectable, Inject } from '../container';
import { UserService, IUserService } from './user.service';
import { DatabaseService } from './database.service';

export interface IAuthService {
  login(username: string, password: string): boolean;
  logout(): void;
}

@Injectable()
export class AuthService implements IAuthService {
  private loggedIn = false;

  constructor(
    private userService: UserService,
    private database: DatabaseService
  ) {
    console.log('🔐 AuthService created');
    this.database.connect();
  }

  login(username: string, password: string): boolean {
    console.log(`🔑 Attempting login for user: ${username}`);
    this.loggedIn = true;
    return true;
  }

  logout(): void {
    this.loggedIn = false;
    console.log('🚪 User logged out');
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}