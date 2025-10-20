import { Injectable } from '../container';

export interface IDatabase {
  connect(): void;
  query(sql: string): any[];
}

@Injectable()
export class DatabaseService implements IDatabase {
  private connected = false;

  connect(): void {
    this.connected = true;
    console.log('📦 Database connected');
  }

  query(sql: string): any[] {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    console.log(`📊 Executing query: ${sql}`);
    return [{ id: 1, name: 'Example Data' }];
  }
}