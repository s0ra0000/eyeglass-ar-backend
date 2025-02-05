const pool = require("./db");

const likeEyeglass = async (user_id, eyeglass_id) => {
  const result = await pool.query(
    `INSERT INTO likes (user_id, eyeglass_id) 
     VALUES ($1, $2) 
     ON CONFLICT (user_id, eyeglass_id) DO NOTHING 
     RETURNING *`,
    [user_id, eyeglass_id]
  );
  return result.rows[0];
};

const unlikeEyeglass = async (user_id, eyeglass_id) => {
  await pool.query(
    "DELETE FROM likes WHERE user_id = $1 AND eyeglass_id = $2",
    [user_id, eyeglass_id]
  );
};

const getUserLikedEyeglasses = async (user_id) => {
  const result = await pool.query(
    `SELECT e.* FROM eyeglasses e
     JOIN likes l ON e.id = l.eyeglass_id
     WHERE l.user_id = $1`,
    [user_id]
  );
  return result.rows;
};

const isEyeglassLikedByUser = async (user_id, eyeglass_id) => {
  const result = await pool.query(
    `SELECT COUNT(*) > 0 AS liked FROM likes WHERE user_id = $1 AND eyeglass_id = $2`,
    [user_id, eyeglass_id]
  );
  return result.rows[0].liked;
};

module.exports = {
  likeEyeglass,
  unlikeEyeglass,
  getUserLikedEyeglasses,
  isEyeglassLikedByUser,
};
