import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  const findAssignmentsForCourse = async (courseId) => {
    console.log("[AssignmentsDao] Finding assignments for course:", courseId);
    const assignments = await model.find({ course: courseId });
    console.log("[AssignmentsDao] Found assignments:", assignments.length);
    if (assignments.length > 0) {
      console.log("[AssignmentsDao] First assignment:", { _id: assignments[0]._id, title: assignments[0].title, course: assignments[0].course });
    }
    return assignments;
    // const { assignments } = db;
    // return assignments.filter((assignment) => assignment.course === courseId);
  };

  const findAssignmentById = async (assignmentId) => {
    return await model.findById(assignmentId);
    // return db.assignments.find((assignment) => assignment._id === assignmentId);
  };

  const createAssignment = async (assignment) => {
    const newAssignment = { ...assignment, _id: assignment._id || uuidv4() };
    return await model.create(newAssignment);
    // const newAssignment = { ...assignment, _id: uuidv4() };
    // db.assignments = [...db.assignments, newAssignment];
    // return newAssignment;
  };

  const updateAssignment = async (assignmentId, assignmentUpdates) => {
    const updated = await model.findByIdAndUpdate(
      assignmentId,
      { $set: assignmentUpdates },
      { new: true }
    );
    return updated;
    // const assignment = findAssignmentById(assignmentId);
    // if (!assignment) {
    //   return null;
    // }
    // Object.assign(assignment, assignmentUpdates);
    // return assignment;
  };

  const deleteAssignment = async (assignmentId) => {
    return await model.deleteOne({ _id: assignmentId });
    // const { assignments } = db;
    // db.assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
    // return { status: "ok" };
  };

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
