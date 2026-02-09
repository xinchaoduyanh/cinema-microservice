import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import path from 'path';
import { databaseConfig } from 'src/config/database.config';

const cliConfig = {
  ...databaseConfig,
  migrations: {
    path: path.join(__dirname, 'src/database/migrations'),
  },
  extensions: [Migrator],
  seeder: {
    path: path.join(__dirname, 'src/database/seeders'),
    defaultSeeder: 'UserSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts' as const,
    fileName: (className: string) => className,
  },
};

const ormConfig: MikroOrmModuleOptions = {
  ...databaseConfig,
  ...cliConfig,
};

export default ormConfig;
