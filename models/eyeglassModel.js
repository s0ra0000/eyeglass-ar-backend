// models/eyeglassModel.js
const pool = require("./db");

const getAllEyeglasses = async (user_id) => {
  const result = await pool.query(
    `SELECT e.*, 
            CASE WHEN l.user_id IS NOT NULL THEN true ELSE false END AS is_liked
     FROM eyeglasses e
     LEFT JOIN likes l ON e.id = l.eyeglass_id AND l.user_id = $1`,
    [user_id]
  );
  return result.rows;
};

const getEyeglassById = async (id) => {
  const result = await pool.query("SELECT * FROM eyeglasses WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

const createEyeglass = async (eyeglass) => {
  const { name, description, image_url, model_url } = eyeglass;
  const result = await pool.query(
    "INSERT INTO eyeglasses (name, description, image_url, model_url) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, description, image_url, model_url]
  );
  return result.rows[0];
};

const updateEyeglass = async (id, eyeglass) => {
  const { name, description, image_url, model_url } = eyeglass;
  const result = await pool.query(
    "UPDATE eyeglasses SET name = $1, description = $2, image_url = $3, model_url = $4 WHERE id = $5 RETURNING *",
    [name, description, image_url, model_url, id]
  );
  return result.rows[0];
};

const deleteEyeglass = async (id) => {
  await pool.query("DELETE FROM eyeglasses WHERE id = $1", [id]);
};

module.exports = {
  getAllEyeglasses,
  getEyeglassById,
  createEyeglass,
  updateEyeglass,
  deleteEyeglass,
};
