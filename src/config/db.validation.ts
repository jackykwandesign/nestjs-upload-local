import { plainToInstance } from 'class-transformer'
import { IsNumber, IsString, validateSync } from 'class-validator'

class EnvironmentVariables {
  // MongoDB
  @IsString()
  DB_NAME: string

  @IsString()
  DB_HOST: string

  @IsNumber()
  DB_PORT: number

  @IsString()
  DB_USERNAME: string

  @IsString()
  DB_PASSWORD: string

  // @IsString()
  // DB_SYNC: number;

  @IsString()
  DB_PROVIDER: string

  // CassandraDB
  @IsString()
  CASSANDRA_CONTACT_POINTS: string

  @IsString()
  CASSANDRA_KEYSPACE: string

  @IsString()
  CASSANDRA_DATACENTER: string

  @IsString()
  CASSANDRA_USERNAME: string

  @IsString()
  CASSANDRA_PASSWORD: string

  @IsNumber()
  CASSANDRA_PORT: number

  @IsString()
  KAFKA_BROKER_URLS: string
}

export function validateDBConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}
