const mongoose = require('mongoose');

let memoryServerInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/electromart';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout to fallback if local mongod is offline
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Could not connect to primary URI (${uri}): ${err.message}`);
    
    // Attempt fallback to mongodb-memory-server for zero-setup local dev/testing
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[MongoDB] Starting MongoMemoryServer for standalone zero-configuration demonstration...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServerInstance = await MongoMemoryServer.create({
          instance: {
            dbName: 'electromart'
          }
        });
        const memUri = memoryServerInstance.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`[MongoDB] Connected to in-memory instance: ${memUri}`);
        return conn;
      } catch (memErr) {
        console.error('[MongoDB] In-Memory MongoDB fallback failed:', memErr.message);
      }
    }

    console.error('================================================================');
    console.error('ERROR: Could not establish a connection to MongoDB.');
    console.error('Please make sure MongoDB is running locally on 127.0.0.1:27017');
    console.error('OR specify a MongoDB Atlas connection string in backend/.env:');
    console.error('MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/electromart');
    console.error('================================================================');
    throw err;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
    }
  } catch (err) {
    console.error('[MongoDB] Error disconnecting:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
