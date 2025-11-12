import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  const findAssignmentsForCourse = (courseId) => {
    const { assignments } = db;
    return assignments.filter((assignment) => assignment.course === courseId);
  };

  const findAssignmentById = (assignmentId) =>
    db.assignments.find((assignment) => assignment._id === assignmentId);

  const createAssignment = (assignment) => {
    const newAssignment = { ...assignment, _id: uuidv4() };
    db.assignments = [...db.assignments, newAssignment];
    return newAssignment;
  };

  const updateAssignment = (assignmentId, assignmentUpdates) => {
    const assignment = findAssignmentById(assignmentId);
    if (!assignment) {
      return null;
    }
    Object.assign(assignment, assignmentUpdates);
    return assignment;
  };

  const deleteAssignment = (assignmentId) => {
    const { assignments } = db;
    db.assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
    return { status: "ok" };
  };

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
