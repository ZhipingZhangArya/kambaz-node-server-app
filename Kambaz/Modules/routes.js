import ModulesDao from "./dao.js";

export default function ModulesRoutes(app, db) {
  const dao = ModulesDao(db);

  const findModulesForCourse = async (req, res) => {
    const { courseId } = req.params;
    console.log("[findModulesForCourse] Fetching modules for course:", courseId);
    const modules = await dao.findModulesForCourse(courseId);
    console.log("[findModulesForCourse] Found modules:", modules?.length || 0);
    if (modules && modules.length > 0) {
      console.log("[findModulesForCourse] First module:", { _id: modules[0]._id, name: modules[0].name });
    }
    res.json(modules);
  };

  const createModuleForCourse = async (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      // course: courseId,
    };
    const newModule = await dao.createModule(courseId, module);
    res.send(newModule);
  };

  const deleteModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const status = await dao.deleteModule(courseId, moduleId);
    res.send(status);
  };

  const updateModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const moduleUpdates = req.body;
    const updated = await dao.updateModule(courseId, moduleId, moduleUpdates);
    if (!updated) {
      res.status(404).json({ message: `Module ${moduleId} not found` });
      return;
    }
    res.send(updated);
  };

  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
  app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
}
