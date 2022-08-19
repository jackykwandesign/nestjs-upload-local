import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as fs from 'fs'
import * as path from 'path'
import { parseBoolean } from '../utils/parseBoolean'
// https://orkhan.gitbook.io/typeorm/docs/connection-options#mongodb-connection-options
// https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

let typeOrmMongoDBConfig: TypeOrmModuleOptions = {}
switch (process.env.DB_PROVIDER) {
  case 'AWS':
    const sslCAString = fs.readFileSync(
      path.join(__dirname, 'rds-combined-ca-bundle.pem'),
      { encoding: 'utf8' }
    )
    typeOrmMongoDBConfig = {
      type: 'mongodb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: parseBoolean(process.env.DB_SYNC),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      useUnifiedTopology: true,
      useNewUrlParser: true,
      ssl: true,
      authSource: 'admin',
      sslValidate: parseBoolean(process.env.DB_SSLVALIDATE),
      sslCA: sslCAString,
    }
    break
  case 'ATLAS':
    typeOrmMongoDBConfig = {
      type: 'mongodb',
      url: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true`,
      authSource: 'admin',
      ssl: true,
      replicaSet: 'atlas-1r2whb-shard-0',
      synchronize: parseBoolean(process.env.DB_SYNC),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
    break
  default:
    // normal connection
    typeOrmMongoDBConfig = {
      type: 'mongodb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: parseBoolean(process.env.DB_SYNC),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      useUnifiedTopology: true,
      useNewUrlParser: true,
      authSource: 'admin',
    }
}

export { typeOrmMongoDBConfig }
