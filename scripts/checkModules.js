import 'dotenv/config';
import mongoose from 'mongoose';
import courseSchema from '../Kambaz/Courses/schema.js';

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/kambaz';

mongoose.connect(CONNECTION_STRING).then(async () => {
  console.log('Connected to MongoDB');
  console.log('Connection string:', CONNECTION_STRING.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

  const CourseModel = mongoose.model('CourseModel', courseSchema);
  const db = mongoose.connection.db;
  
  // Check modules collection
  const modulesCollection = db.collection('modules');
  const modules = await modulesCollection.find({}).toArray();
  console.log(`\nFound ${modules.length} modules in the modules collection`);
  
  if (modules.length > 0) {
    console.log('\nSample module:');
    console.log(JSON.stringify(modules[0], null, 2));
  }
  
  // Check courses collection
  const courses = await CourseModel.find({}).limit(5);
  console.log(`\nFound ${courses.length} courses (showing first 5):`);
  
  for (const course of courses) {
    const courseObj = course.toObject ? course.toObject() : course;
    console.log(`\nCourse: ${courseObj._id} (${courseObj.name})`);
    console.log(`  Has modules field: ${courseObj.modules !== undefined}`);
    console.log(`  Modules type: ${Array.isArray(courseObj.modules) ? 'array' : typeof courseObj.modules}`);
    console.log(`  Modules count: ${Array.isArray(courseObj.modules) ? courseObj.modules.length : 'N/A'}`);
    if (Array.isArray(courseObj.modules) && courseObj.modules.length > 0) {
      console.log(`  First module: ${courseObj.modules[0].name}`);
    }
  }
  
  // Check specific course RS101
  const rs101 = await CourseModel.findById('RS101');
  if (rs101) {
    const rs101Obj = rs101.toObject ? rs101.toObject() : rs101;
    console.log(`\n\nCourse RS101 details:`);
    console.log(JSON.stringify(rs101Obj, null, 2));
  } else {
    console.log('\n\nCourse RS101 not found!');
  }
  
  await mongoose.connection.close();
  console.log('\nConnection closed');
  process.exit(0);
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

