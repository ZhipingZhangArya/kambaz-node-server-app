import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the JSON files
const coursesPath = path.join(__dirname, '../../kambaz-next-js/app/(Kambaz)/Database/courses.json');
const modulesPath = path.join(__dirname, '../../kambaz-next-js/app/(Kambaz)/Database/modules.json');

const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
const modules = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));

// Group modules by course
const modulesByCourse = {};
modules.forEach(module => {
  const courseId = module.course;
  if (!modulesByCourse[courseId]) {
    modulesByCourse[courseId] = [];
  }
  // Remove the 'course' field and 'module' field from lessons, keep only the module data
  const embeddedModule = {
    _id: module._id,
    name: module.name,
    description: module.description,
    lessons: (module.lessons || []).map(lesson => ({
      _id: lesson._id,
      name: lesson.name,
      description: lesson.description
    }))
  };
  modulesByCourse[courseId].push(embeddedModule);
});

// Embed modules into courses
const coursesWithModules = courses.map(course => ({
  ...course,
  modules: modulesByCourse[course._id] || []
}));

// Write the result to a new file
const outputPath = path.join(__dirname, '../../kambaz-next-js/app/(Kambaz)/Database/courses-with-modules.json');
fs.writeFileSync(outputPath, JSON.stringify(coursesWithModules, null, 2), 'utf8');

console.log(`Successfully created courses-with-modules.json with ${coursesWithModules.length} courses`);
console.log(`Total modules embedded: ${modules.length}`);
