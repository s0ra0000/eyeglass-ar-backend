// index.js
const fastify = require("fastify")({ logger: true });
require("dotenv").config();

// Register plugins
fastify.register(require("fastify-jwt"), {
  secret: process.env.JWT_SECRET,
});

fastify.register(require("@fastify/cors"), {
  origin: "*",
});

fastify.register(require("@fastify/multipart"), {
  limits: {
    // Increase the maximum file size limit (in bytes)
    fileSize: 100 * 1024 * 1024, // 100 MB
  },
});

// Register routes
fastify.register(require("./routes/authRoutes"), { prefix: "/auth" });
fastify.register(require("./routes/eyeglassRoutes"), { prefix: "/eyeglasses" });

// Run the server!
const start = async () => {
  try {
    await fastify.listen({
      port: parseInt(process.env.PORT, 10) || 3000,
      host: "0.0.0.0",
    });
    fastify.log.info(`Server is running on port ${process.env.PORT || 3000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

fastify.setErrorHandler(function (error, request, reply) {
  request.log.error(error);
  reply.status(error.statusCode || 500).send({ message: error.message });
});
