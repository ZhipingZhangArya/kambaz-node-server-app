import 'dotenv/config';
import mongoose from 'mongoose';
import courseSchema from '../Kambaz/Courses/schema.js';

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/kambaz';

mongoose.connect(CONNECTION_STRING).then(async () => {
  console.log('Connected to MongoDB');

  const CourseModel = mongoose.model('CourseModel', courseSchema);
  
  // Access the modules collection directly using mongoose.connection
  const db = mongoose.connection.db;
  const modulesCollection = db.collection('modules');

  // Fetch all modules from the modules collection
  const modules = await modulesCollection.find({}).toArray();
  console.log(`Found ${modules.length} modules in the modules collection`);
  
  // Log first module to see its structure
  if (modules.length > 0) {
    console.log('\nSample module structure:');
    console.log(JSON.stringify(modules[0], null, 2));
  }

  // Group modules by course
  const modulesByCourse = {};
  modules.forEach(module => {
    const courseId = module.course;
    if (!courseId) {
      console.warn(`Module ${module._id} has no course field, skipping`);
      return;
    }
    if (!modulesByCourse[courseId]) {
      modulesByCourse[courseId] = [];
    }
    // Convert module to embedded format (remove 'course' and 'module' fields from lessons, keep lessons)
    const embeddedModule = {
      _id: module._id,
      name: module.name,
      description: module.description,
      lessons: (module.lessons || []).map(lesson => ({
        _id: lesson._id,
        name: lesson.name,
        description: lesson.description
        // Remove 'module' field from lesson
      }))
    };
    modulesByCourse[courseId].push(embeddedModule);
  });

  console.log(`\nGrouped modules by course:`);
  Object.keys(modulesByCourse).forEach(courseId => {
    console.log(`  ${courseId}: ${modulesByCourse[courseId].length} modules`);
  });

  // Update each course with its modules
  let updated = 0;
  let notFound = 0;

  for (const [courseId, courseModules] of Object.entries(modulesByCourse)) {
    try {
      const course = await CourseModel.findById(courseId);
      if (course) {
        await CourseModel.updateOne(
          { _id: courseId },
          { $set: { modules: courseModules } }
        );
        console.log(`✓ Updated course ${courseId} (${course.name}) with ${courseModules.length} modules`);
        updated++;
      } else {
        console.warn(`✗ Course ${courseId} not found in courses collection`);
        notFound++;
      }
    } catch (error) {
      console.error(`✗ Error updating course ${courseId}:`, error.message);
    }
  }

  console.log(`\nEmbedding complete!`);
  console.log(`- Updated: ${updated} courses`);
  console.log(`- Not found: ${notFound} courses`);

  await mongoose.connection.close();
  console.log('Connection closed');
  process.exit(0);
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});
