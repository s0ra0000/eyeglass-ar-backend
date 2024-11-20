// models/eyeglassModel.js
const pool = require("./db");

const getAllEyeglasses = async () => {
  const result = await pool.query("SELECT * FROM eyeglasses");
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
