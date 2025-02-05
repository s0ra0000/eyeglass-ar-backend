const likeController = require("../controllers/likeController");

async function likeRoutes(fastify, options) {
  fastify.addHook("preHandler", async (request, reply) => {
    try {
      const decoded = await request.jwtVerify(); // Verify JWT
      request.user = decoded; // Attach user info
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });

  fastify.post("/like", likeController.likeEyeglass);
  fastify.post("/unlike", likeController.unlikeEyeglass);
  fastify.get("/liked-eyeglasses", likeController.getUserLikedEyeglasses);
  fastify.get("/is-liked", likeController.isEyeglassLikedByUser);
}

module.exports = likeRoutes;
