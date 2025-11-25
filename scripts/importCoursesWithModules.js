import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import courseSchema from '../Kambaz/Courses/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/kambaz';

mongoose.connect(CONNECTION_STRING).then(async () => {
  console.log('Connected to MongoDB');

  const CourseModel = mongoose.model('CourseModel', courseSchema);

  // Try to find the courses-with-modules.json file
  let coursesPath;
  const possiblePaths = [
    path.join(__dirname, '../../kambaz-next-js/app/(Kambaz)/Database/courses-with-modules.json'),
    path.join(process.cwd(), '../kambaz-next-js/app/(Kambaz)/Database/courses-with-modules.json'),
    path.join(__dirname, '../kambaz-next-js/app/(Kambaz)/Database/courses-with-modules.json'),
  ];

  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      coursesPath = possiblePath;
      break;
    }
  }

  if (!coursesPath) {
    console.log('courses-with-modules.json not found, trying to create it first...');
    // Try to run the embed script first
    const embedScript = path.join(__dirname, 'embedModulesInCourses.js');
    if (fs.existsSync(embedScript)) {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);
      try {
        await execAsync(`node ${embedScript}`);
        // Try to find the file again
        for (const possiblePath of possiblePaths) {
          if (fs.existsSync(possiblePath)) {
            coursesPath = possiblePath;
            break;
          }
        }
      } catch (error) {
        console.error('Error running embed script:', error);
      }
    }
  }

  if (!coursesPath) {
    console.error('Could not find or create courses-with-modules.json file.');
    console.log('Tried paths:', possiblePaths);
    process.exit(1);
  }

  console.log(`Reading courses from: ${coursesPath}`);
  const coursesData = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));

  console.log(`Found ${coursesData.length} courses to import`);

  let imported = 0;
  let updated = 0;
  let skipped = 0;

  for (const course of coursesData) {
    try {
      const existing = await CourseModel.findById(course._id);
      if (existing) {
        // Update existing course with modules
        await CourseModel.updateOne(
          { _id: course._id },
          { $set: { modules: course.modules || [] } }
        );
        console.log(`Updated ${course._id} (${course.name}) with ${(course.modules || []).length} modules`);
        updated++;
      } else {
        // Create new course
        await CourseModel.create(course);
        console.log(`Imported ${course._id} (${course.name}) with ${(course.modules || []).length} modules`);
        imported++;
      }
    } catch (error) {
      console.error(`Error importing/updating ${course._id}:`, error.message);
      skipped++;
    }
  }

  console.log(`\nImport complete!`);
  console.log(`- Imported: ${imported} courses`);
  console.log(`- Updated: ${updated} courses`);
  console.log(`- Skipped: ${skipped} courses`);

  await mongoose.connection.close();
  console.log('Connection closed');
  process.exit(0);
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});
