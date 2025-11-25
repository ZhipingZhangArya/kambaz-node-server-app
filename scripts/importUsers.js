import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import userSchema from '../Kambaz/Users/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/kambaz';

mongoose.connect(CONNECTION_STRING).then(async () => {
  console.log('Connected to MongoDB');
  
  // Get UserModel
  const UserModel = mongoose.model('UserModel', userSchema);
  
  // Read users.json file - try multiple possible paths
  let usersPath;
  const possiblePaths = [
    path.join(__dirname, '../../kambaz-next-js/app/(Kambaz)/Database/users.json'),
    path.join(process.cwd(), '../kambaz-next-js/app/(Kambaz)/Database/users.json'),
    path.join(__dirname, '../kambaz-next-js/app/(Kambaz)/Database/users.json'),
  ];
  
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      usersPath = possiblePath;
      break;
    }
  }
  
  if (!usersPath) {
    console.error('Could not find users.json file. Please check the path.');
    console.log('Tried paths:', possiblePaths);
    process.exit(1);
  }
  
  console.log(`Reading users from: ${usersPath}`);
  const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  
  console.log(`Found ${usersData.length} users to import`);
  
  // Clear existing users (optional - comment out if you want to keep existing users)
  // await UserModel.deleteMany({});
  // console.log('Cleared existing users');
  
  // Import users
  let imported = 0;
  let skipped = 0;
  
  for (const user of usersData) {
    try {
      // Check if user already exists
      const existing = await UserModel.findOne({ username: user.username });
      if (existing) {
        console.log(`Skipping ${user.username} - already exists`);
        skipped++;
        continue;
      }
      
      // Ensure _id is a string
      const userToImport = {
        ...user,
        _id: user._id || user.username,
      };
      
      await UserModel.create(userToImport);
      console.log(`Imported ${user.username} (${user.role})`);
      imported++;
    } catch (error) {
      console.error(`Error importing ${user.username}:`, error.message);
    }
  }
  
  console.log(`\nImport complete!`);
  console.log(`- Imported: ${imported} users`);
  console.log(`- Skipped: ${skipped} users`);
  
  // Close connection
  await mongoose.connection.close();
  console.log('Connection closed');
  process.exit(0);
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});
