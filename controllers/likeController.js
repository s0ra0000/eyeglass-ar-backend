const likeModel = require("../models/likeModel");

const likeEyeglass = async (request, reply) => {
  const { eyeglass_id } = request.body;
  const user_id = request.user.id; // Extracted from JWT

  try {
    const likedEyeglass = await likeModel.likeEyeglass(user_id, eyeglass_id);
    if (likedEyeglass) {
      return reply.send({ success: true, message: "Eyeglass liked!" });
    }
    return reply.send({ success: false, message: "Eyeglass already liked!" });
  } catch (error) {
    return reply.status(500).send({ success: false, error: error.message });
  }
};

const unlikeEyeglass = async (request, reply) => {
  const { eyeglass_id } = request.body;
  const user_id = request.user.id; // Extracted from JWT

  try {
    await likeModel.unlikeEyeglass(user_id, eyeglass_id);
    return reply.send({ success: true, message: "Eyeglass unliked!" });
  } catch (error) {
    return reply.status(500).send({ success: false, error: error.message });
  }
};

const getUserLikedEyeglasses = async (request, reply) => {
  const user_id = request.user.id; // Extracted from JWT

  try {
    const likedEyeglasses = await likeModel.getUserLikedEyeglasses(user_id);
    return reply.send(likedEyeglasses);
  } catch (error) {
    return reply.status(500).send({ success: false, error: error.message });
  }
};

const isEyeglassLikedByUser = async (request, reply) => {
  const { eyeglass_id } = request.query;
  const user_id = request.user.id; // Extracted from JWT

  try {
    const isLiked = await likeModel.isEyeglassLikedByUser(user_id, eyeglass_id);
    return reply.send({ success: true, liked: isLiked });
  } catch (error) {
    return reply.status(500).send({ success: false, error: error.message });
  }
};

module.exports = {
  likeEyeglass,
  unlikeEyeglass,
  getUserLikedEyeglasses,
  isEyeglassLikedByUser,
};
