import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  const findAllCourses = () => db.courses;

  const findCoursesForEnrolledUser = (userId) => {
    const { courses, enrollments } = db;
    return courses.filter((course) =>
      enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id
      )
    );
  };

  const createCourse = (course) => {
    const newCourse = { ...course, _id: uuidv4() };
    db.courses = [...db.courses, newCourse];
    return newCourse;
  };

  const deleteCourse = (courseId) => {
    const { courses, enrollments } = db;
    db.courses = courses.filter((course) => course._id !== courseId);
    db.enrollments = enrollments.filter(
      (enrollment) => enrollment.course !== courseId
    );
    return { status: "ok" };
  };

  const updateCourse = (courseId, courseUpdates) => {
    const course = db.courses.find((c) => c._id === courseId);
    if (!course) {
      return null;
    }
    Object.assign(course, courseUpdates);
    return course;
  };

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
