import 'reflect-metadata';
import { container } from './container';
import { AppController } from './app.controller';

function bootstrap() {
  console.log('🔧 Bootstrapping application...');
  
  const app = container.get(AppController);
  
  app.run();
}

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

bootstrap();