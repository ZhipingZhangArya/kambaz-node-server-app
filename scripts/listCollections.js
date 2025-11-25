import 'dotenv/config';
import mongoose from 'mongoose';

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/kambaz';

mongoose.connect(CONNECTION_STRING).then(async () => {
  console.log('Connected to MongoDB');
  console.log('Connection string:', CONNECTION_STRING.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

  const db = mongoose.connection.db;
  
  // List all collections
  const collections = await db.listCollections().toArray();
  console.log(`\nFound ${collections.length} collections in database:`);
  
  for (const collection of collections) {
    const collectionName = collection.name;
    const count = await db.collection(collectionName).countDocuments();
    
    console.log(`\n${collectionName}:`);
    console.log(`  - Document count: ${count}`);
    
    // Try to get stats, but it might not be available
    try {
      const stats = await db.command({ collStats: collectionName });
      console.log(`  - Storage size: ${(stats.size / 1024).toFixed(2)} kB`);
      console.log(`  - Average document size: ${(stats.avgObjSize || 0).toFixed(2)} B`);
    } catch (error) {
      console.log(`  - Stats: Not available`);
    }
  }
  
  await mongoose.connection.close();
  console.log('\nConnection closed');
  process.exit(0);
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

