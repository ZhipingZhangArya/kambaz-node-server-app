import { v4 as uuidv4 } from "uuid";

export default function UsersDao(db) {
  let { users } = db;

  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    users = [...users, newUser];
    return newUser;
  };

  const findAllUsers = () => users;

  const findUserById = (userId) => users.find((user) => user._id === userId);

  const findUserByUsername = (username) =>
    users.find((user) => user.username === username);

  const findUserByCredentials = (username, password) =>
    users.find(
      (user) => user.username === username && user.password === password
    );

  const updateUser = (userId, user) => {
    users = users.map((u) => (u._id === userId ? { ...u, ...user } : u));
    return findUserById(userId);
  };

  const deleteUser = (userId) => {
    users = users.filter((u) => u._id !== userId);
    return users;
  };

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
  };
}
