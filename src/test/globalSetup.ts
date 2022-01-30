import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

import { mongoConfig } from './mongo-config';

export = async function globalSetup() {
  if (mongoConfig.Memory) {
    const instance = await MongoMemoryServer.create({
      instance: {
        dbName: mongoConfig.DataBase,
        ip: mongoConfig.IP,
        port: mongoConfig.Port,
      },
    });
    const uri = instance.getUri();

    (global as any).__MONGOINSTANCE = instance;

    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
  } else {
    process.env.MONGO_URI = `mongodb://${mongoConfig.IP}:${mongoConfig.Port}`;
  }

  // The following is to make sure the database is clean before an test starts
  await mongoose.connect(
    `${process.env.MONGO_URI}/${mongoConfig.DataBase}`,
    {},
  );
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
};
