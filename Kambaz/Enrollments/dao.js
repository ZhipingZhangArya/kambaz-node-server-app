import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  const enrollUserInCourse = (userId, courseId) => {
    const existing = db.enrollments.find(
      (enrollment) =>
        enrollment.user === userId && enrollment.course === courseId
    );
    if (existing) {
      return existing;
    }
    const newEnrollment = {
      _id: uuidv4(),
      user: userId,
      course: courseId,
    };
    db.enrollments = [...db.enrollments, newEnrollment];
    return newEnrollment;
  };

  const unenrollUserFromCourse = (userId, courseId) => {
    const existing = db.enrollments.find(
      (enrollment) =>
        enrollment.user === userId && enrollment.course === courseId
    );
    if (!existing) {
      return { status: "not enrolled" };
    }
    db.enrollments = db.enrollments.filter(
      (enrollment) => enrollment._id !== existing._id
    );
    return { status: "ok" };
  };

  const findEnrollmentsForUser = (userId) => {
    return db.enrollments.filter((enrollment) => enrollment.user === userId);
  };

  const findEnrollmentsForCourse = (courseId) => {
    return db.enrollments.filter((enrollment) => enrollment.course === courseId);
  };

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
  };
}
