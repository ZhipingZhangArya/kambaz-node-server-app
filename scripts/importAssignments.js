import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import assignmentSchema from '../Kambaz/Assignments/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/kambaz';

mongoose.connect(CONNECTION_STRING).then(async () => {
  console.log('Connected to MongoDB');
  console.log('Connection string:', CONNECTION_STRING.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

  const AssignmentModel = mongoose.model('AssignmentModel', assignmentSchema);
  
  // Read assignments.json file
  const assignmentsPath = path.join(__dirname, '../../kambaz-next-js/app/(Kambaz)/Database/assignments.json');
  console.log(`\nReading assignments from: ${assignmentsPath}`);
  
  if (!fs.existsSync(assignmentsPath)) {
    console.error(`Error: File not found at ${assignmentsPath}`);
    process.exit(1);
  }
  
  const assignmentsData = JSON.parse(fs.readFileSync(assignmentsPath, 'utf8'));
  console.log(`Found ${assignmentsData.length} assignments in JSON file`);
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const assignment of assignmentsData) {
    try {
      // Check if assignment already exists
      const existing = await AssignmentModel.findById(assignment._id);
      if (existing) {
        console.log(`  ⏭  Skipping ${assignment._id} (already exists)`);
        skipped++;
        continue;
      }
      
      // Create new assignment
      await AssignmentModel.create(assignment);
      console.log(`  ✓ Imported ${assignment._id}: ${assignment.title}`);
      imported++;
    } catch (error) {
      console.error(`  ✗ Error importing ${assignment._id}:`, error.message);
      errors++;
    }
  }
  
  console.log(`\nImport complete!`);
  console.log(`- Imported: ${imported} assignments`);
  console.log(`- Skipped: ${skipped} assignments (already exist)`);
  console.log(`- Errors: ${errors} assignments`);
  
  // Verify import
  const totalCount = await AssignmentModel.countDocuments({});
  console.log(`\nTotal assignments in database: ${totalCount}`);
  
  await mongoose.connection.close();
  console.log('Connection closed');
  process.exit(0);
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

