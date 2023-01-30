const connection = require("./connection");
// busca todas as tasks no banco de dados
const getAll = async () => {
  const tasks = await connection.execute("SELECT * FROM tasks");
  return tasks[0];
};

const createTask = async (task) => {
  const { title } = task;
  const dateUTC = new Date(Date.now()).toUTCString();
  const query =
    "INSERT INTO tasks(taskTitle, taskStatus, create_at) VALUES (?, ?, ?)";
  const [createdTask] = await connection.execute(query, [
    title,
    "pendente",
    dateUTC,
  ]);
  return { insertId: createdTask.insertId };
};

const deleteTask = async (id) => {
  const removedTask = await connection.execute(
    "DELETE FROM tasks where id = ?",
    [id]
  );
  return removedTask;
};

const updateTask = async (id, task) => {
  const { title, status } = task;
  const query = "UPDATE tasks SET taskTitle = ?, taskStatus = ? where id = ?";
  const updatedTask = await connection.execute(query, [title, status, id]);
  return updatedTask;
};

module.exports = {
  getAll,
  createTask,
  deleteTask,
  updateTask,
};