import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdf';

    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri(), {});
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongoServer) {
        await mongoServer.stop();
        await mongoose.connection.close();
    }

});