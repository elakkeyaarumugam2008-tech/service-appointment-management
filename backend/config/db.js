import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/service_appointment_db';

  try {
    // Attempt connecting to specified MongoDB server with 2.5s timeout
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    console.log(`[MongoDB] Connected to database server at: ${uri}`);
  } catch (err) {
    console.warn(`[MongoDB Warning] Could not connect to primary MongoDB server at ${uri}: ${err.message}`);
    console.log('[MongoDB] Initializing fallback in-memory MongoDB instance...');
    
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[MongoDB] Connected successfully to fallback in-memory MongoDB at: ${memoryUri}`);
    } catch (memErr) {
      console.error('[MongoDB Error] Failed to start fallback database:', memErr);
      process.exit(1);
    }
  }
};
