import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    console.log("[findAssignmentsForCourse] Fetching assignments for course:", courseId);
    const assignments = await dao.findAssignmentsForCourse(courseId);
    console.log("[findAssignmentsForCourse] Found assignments:", assignments?.length || 0);
    if (assignments && assignments.length > 0) {
      console.log("[findAssignmentsForCourse] First assignment:", { _id: assignments[0]._id, title: assignments[0].title });
    }
    res.json(assignments);
  };

  const findAssignmentById = async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await dao.findAssignmentById(assignmentId);
    if (!assignment) {
      res.status(404).json({ message: `Assignment ${assignmentId} not found` });
      return;
    }
    res.json(assignment);
  };

  const createAssignment = async (req, res) => {
    const { courseId } = req.params;
    const assignment = {
      ...req.body,
      course: courseId,
    };
    const newAssignment = await dao.createAssignment(assignment);
    res.json(newAssignment);
  };

  const updateAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const updated = await dao.updateAssignment(assignmentId, assignmentUpdates);
    if (!updated) {
      res.status(404).json({ message: `Assignment ${assignmentId} not found` });
      return;
    }
    res.json(updated);
  };

  const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const status = await dao.deleteAssignment(assignmentId);
    res.send(status);
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.post("/api/courses/:courseId/assignments", createAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}
