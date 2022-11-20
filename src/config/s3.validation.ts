import { plainToInstance } from 'class-transformer'
import { IsNumber, IsString, validateSync } from 'class-validator'

class EnvironmentVariables {

  @IsString()
  AWS_S3_ACCESS_KEY_ID: string

  @IsString()
  AWS_S3_SECRET_ACCESS_KEY: string

  @IsString()
  AWS_S3_BUCKET: string

  @IsString()
  AWS_S3_REGION: string

  @IsString()
  AWS_SNS_REGION: string

  @IsString()
  AWS_SNS_ACCESS_KEY_ID: string

  @IsString()
  AWS_SNS_SECRET_ACCESS_KEY: string

}

export function validateS3Config(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}
