import { Injectable, Inject } from './container';
import { AuthService, IAuthService } from './test_services/auth.service';
import { UserService, IUserService } from './test_services/user.service';

@Injectable()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    console.log('🎮 AppController created');
  }

  run(): void {
    console.log('\n=== 🚀 Starting Application ===\n');

    this.authService.login('admin', 'password');
    const users = this.userService.getUsers();
    console.log('📋 Users:', users);
    
    const user = this.userService.getUserById(1);
    console.log('👤 User by ID:', user);

    console.log('\n=== ✅ Application Finished ===\n');
  }
}