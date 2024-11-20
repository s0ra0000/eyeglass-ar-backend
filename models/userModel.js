// models/userModel.js
const pool = require("./db");

const createUser = async (user) => {
  const { username, email, password, role } = user;
  const result = await pool.query(
    "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [username, email, password, role]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
};
