// utils/helpers.js
const verifyJWT = async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
};

const verifyAdmin = async (req, reply) => {
  try {
    await req.jwtVerify();
    if (req.user.role !== "admin") {
      return reply.status(403).send({ message: "Forbidden" });
    }
  } catch (err) {
    reply.send(err);
  }
};

module.exports = {
  verifyJWT,
  verifyAdmin,
};
