import { parseBoolean } from "src/utils/parseBoolean"

// for nested data or special process data
export class DBConf {
	host: string
	dbName: string
	port: number
	userName: string
	password: string
	sync: boolean
	provider: string
	constructor(data: DBConf) {
		Object.assign(this, data)
	}
}

export class AWSConf {
	region: string
	credentials: {
		accessKeyId: string
		secretAccessKey: string
	}
	constructor(data: AWSS3Conf) {
		Object.assign(this, data)
	}
}

export class AWSS3Conf extends AWSConf{
	bucket: string
	constructor(data: AWSS3Conf) {
    super(data)
		Object.assign(this, data)
	}
}

export default () => ({
	db: new DBConf({
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT, 10),
		dbName: process.env.DB_NAME,
		userName: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		sync: parseBoolean(process.env.DB_SYNC),
		provider: process.env.DB_PROVIDER,
	}),
	s3: new AWSS3Conf({
		bucket: process.env.AWS_S3_BUCKET,
		region: process.env.AWS_S3_REGION,
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		},
	}),
})
