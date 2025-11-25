import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";

export default function ModulesDao(db) {
  async function findModulesForCourse(courseId) {
    console.log("[ModulesDao] Finding modules for course:", courseId);
    const course = await model.findById(courseId);
    if (!course) {
      console.log("[ModulesDao] Course not found:", courseId);
      return [];
    }
    console.log("[ModulesDao] Course found, modules field:", {
      hasModules: !!course.modules,
      modulesType: Array.isArray(course.modules) ? 'array' : typeof course.modules,
      modulesLength: Array.isArray(course.modules) ? course.modules.length : 'N/A'
    });
    // Ensure modules is always an array
    const modules = course.modules || [];
    console.log("[ModulesDao] Returning modules:", modules.length);
    return modules;
    // const { modules } = Database;
    // return modules.filter((module) => module.course === courseId);
  }

  async function createModule(courseId, module) {
    const newModule = { ...module, _id: uuidv4() };
    const status = await model.updateOne(
      { _id: courseId },
      { $push: { modules: newModule } }
    );
    return newModule;
    // db.modules = [...db.modules, newModule];
    // return newModule;
  }

  async function deleteModule(courseId, moduleId) {
    const status = await model.updateOne(
      { _id: courseId },
      { $pull: { modules: { _id: moduleId } } }
    );
    return status;
    // const { modules } = db;
    // Database.modules = modules.filter((module) => module._id !== moduleId);
  }

  async function updateModule(courseId, moduleId, moduleUpdates) {
    // const { modules } = db;
    // const module = modules.find((module) => module._id === moduleId);
    const course = await model.findById(courseId);
    if (!course) {
      return null;
    }
    const module = course.modules.id(moduleId);
    if (!module) {
      return null;
    }
    Object.assign(module, moduleUpdates);
    await course.save();
    return module;
  }

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}
