// routes/eyeglassRoutes.js
const eyeglassController = require("../controllers/eyeglassController");
const { verifyJWT, verifyAdmin } = require("../utils/helpers");

async function eyeglassRoutes(fastify, options) {
  // Public routes
  fastify.get("/", eyeglassController.getEyeglasses);
  fastify.get("/:id/model", eyeglassController.getEyeglassModel);

  // Admin routes
  fastify.post(
    "/",
    { preValidation: [verifyAdmin], preHandler: fastify.multipart },
    eyeglassController.addEyeglass
  );
  fastify.put(
    "/:id",
    { preValidation: [verifyAdmin] },
    eyeglassController.updateEyeglassById
  );
  fastify.delete(
    "/:id",
    { preValidation: [verifyAdmin] },
    eyeglassController.deleteEyeglassById
  );
}

module.exports = eyeglassRoutes;
