import 'dotenv/config';
import mongoose from 'mongoose';
import assignmentSchema from '../Kambaz/Assignments/schema.js';

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/kambaz';

mongoose.connect(CONNECTION_STRING).then(async () => {
  console.log('Connected to MongoDB');
  console.log('Connection string:', CONNECTION_STRING.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

  const AssignmentModel = mongoose.model('AssignmentModel', assignmentSchema);
  
  // Check assignments collection
  const assignments = await AssignmentModel.find({}).limit(10);
  console.log(`\nFound ${assignments.length} assignments (showing first 10):`);
  
  if (assignments.length > 0) {
    console.log('\nSample assignment:');
    const sample = assignments[0].toObject ? assignments[0].toObject() : assignments[0];
    console.log(JSON.stringify(sample, null, 2));
  }
  
  // Check assignments by course
  const courses = ['RS101', 'RS102', 'RS103'];
  for (const courseId of courses) {
    const courseAssignments = await AssignmentModel.find({ course: courseId });
    console.log(`\nCourse ${courseId}: ${courseAssignments.length} assignments`);
    if (courseAssignments.length > 0) {
      courseAssignments.forEach((assignment) => {
        const a = assignment.toObject ? assignment.toObject() : assignment;
        console.log(`  - ${a._id}: ${a.title} (course: ${a.course})`);
      });
    }
  }
  
  // Check total count
  const totalCount = await AssignmentModel.countDocuments({});
  console.log(`\nTotal assignments in database: ${totalCount}`);
  
  await mongoose.connection.close();
  console.log('\nConnection closed');
  process.exit(0);
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

