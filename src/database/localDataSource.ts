import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DB_ENTITIES } from './database.entities';
import { DB_MIGRATIONS } from './database.migrations';

export const LocalDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'nestjs',
  timezone: 'Z',
  entities: DB_ENTITIES,
  synchronize: false,
  migrations: DB_MIGRATIONS,
  migrationsRun: true,
  namingStrategy: new SnakeNamingStrategy(),
});
