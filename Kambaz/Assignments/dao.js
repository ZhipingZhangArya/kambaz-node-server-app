import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  const findAssignmentsForCourse = async (courseId) => {
    return await model.find({ course: courseId });
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
