import mongoose from 'mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';


async function connect(url) {
    // const mongodb = await MongoMemoryServer.create();
    // const getUri = mongodb.getUri();

    // const db = await mongoose.connect(getUri);

    // console.log("Database Connected");
    // return db;

    mongoose.set('strictQuery', true);

     mongoose.connect(url, {
    })
    console.log("Database connected");
}

export default connect;
