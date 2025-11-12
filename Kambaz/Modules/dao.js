import { v4 as uuidv4 } from "uuid";

export default function ModulesDao(db) {
  const findModulesForCourse = (courseId) => {
    const { modules } = db;
    return modules.filter((module) => module.course === courseId);
  };

  const createModule = (module) => {
    const newModule = { ...module, _id: uuidv4() };
    db.modules = [...db.modules, newModule];
    return newModule;
  };

  const deleteModule = (moduleId) => {
    const { modules } = db;
    db.modules = modules.filter((module) => module._id !== moduleId);
    return { status: "ok" };
  };

  const updateModule = (moduleId, moduleUpdates) => {
    const module = db.modules.find((m) => m._id === moduleId);
    if (!module) {
      return null;
    }
    Object.assign(module, moduleUpdates);
    return module;
  };

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}
