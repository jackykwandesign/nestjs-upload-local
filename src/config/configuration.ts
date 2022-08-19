import { parseBoolean } from 'src/utils/parseBoolean'

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

export class CassandraConf {
  contactPoints: string[]
  keyspace: string
  dataCenter: string
  userName: string
  password: string
  port: number
  constructor(data: CassandraConf) {
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
  cassandra: new CassandraConf({
    contactPoints: process.env.CASSANDRA_CONTACT_POINTS.split('@'),
    keyspace: process.env.CASSANDRA_KEYSPACE,
    dataCenter: process.env.CASSANDRA_DATACENTER,
    userName: process.env.CASSANDRA_USERNAME,
    password: process.env.CASSANDRA_PASSWORD,
    port: parseInt(process.env.CASSANDRA_PORT, 10),
  }),
  kafkaBrokers: process.env.KAFKA_BROKER_URLS.split(' '),
})
