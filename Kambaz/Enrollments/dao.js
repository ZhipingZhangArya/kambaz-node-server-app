import model from "./model.js";

export default function EnrollmentsDao(db) {
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }

  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    // Filter out null users (in case user was deleted but enrollment still exists)
    return enrollments.map((enrollment) => enrollment.user).filter((user) => user !== null && user !== undefined);
  }

  async function enrollUserInCourse(userId, courseId) {
    const existing = await model.findOne({ user: userId, course: courseId });
    if (existing) {
      return existing;
    }
    return await model.create({
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`,
    });
    // const { enrollments } = db;
    // enrollments.push({
    //   _id: uuidv4(),
    //   user: userId,
    //   course: courseId,
    // });
  }

  async function unenrollUserFromCourse(user, course) {
    return await model.deleteOne({ user, course });
    // const existing = db.enrollments.find(
    //   (enrollment) =>
    //     enrollment.user === userId && enrollment.course === courseId
    // );
    // if (!existing) {
    //   return { status: "not enrolled" };
    // }
    // db.enrollments = db.enrollments.filter(
    //   (enrollment) => enrollment._id !== existing._id
    // );
    // return { status: "ok" };
  }

  async function unenrollAllUsersFromCourse(courseId) {
    return await model.deleteMany({ course: courseId });
  }

  const findEnrollmentsForUser = async (userId) => {
    return await model.find({ user: userId });
  };

  const findEnrollmentsForCourse = async (courseId) => {
    return await model.find({ course: courseId });
  };

  return {
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
  };
}
