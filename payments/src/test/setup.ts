import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';

declare global {
    var signin: (id?: string) => string;
}


jest.mock('../../nats-wrapper');

process.env.STRIPE_KEY = "sk_test_51L7i4RGHAMj9BoauRbp5pVo4OWwhIqdNwi5UwnatP5cRKA3SvBk5OgugSnbGmqfW6bsNgbfwRQEx3pqFpOTcnsc500rYHmkanY";

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdf';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = (id?: string) => {

    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    };
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token };
    const base64 = Buffer.from(JSON.stringify(session)).toString('base64');
    return `session=${base64}`;

};
