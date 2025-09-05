import { MongoClient, Db } from 'mongodb'

let client: MongoClient
let db: Db
let clientPromise: Promise<MongoClient>

const uri = process.env.MONGODB_URI as string
const dbName = process.env.MONGODB_DB as string

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local')
}

if (!dbName) {
  throw new Error('Please add your Mongo DB name to .env.local')
}

declare global {
  // Para evitar múltiples instancias en desarrollo
  var _mongoClientPromise: Promise<MongoClient>
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function getDb(): Promise<Db> {
  if (!db) {
    const client = await clientPromise
    db = client.db(dbName)
  }
  return db
}
