import {MongoClient,Db} from 'mongodb'
let client:MongoClient
let db:Db

export const connectDB = async():Promise<Db>=>{
    if(db) return db

    client = new MongoClient(process.env.DB_URL!)
    await client.connect()
    db = client.db(process.env.DB_NAME!)
    console.log("admin connected to mongodb") 
    return db
}

