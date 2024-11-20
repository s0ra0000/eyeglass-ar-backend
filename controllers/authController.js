// controllers/authController.js
const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../models/userModel");

const register = async (req, reply) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return reply.status(400).send({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await createUser({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    return reply.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

const login = async (req, reply) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return reply.status(400).send({ message: "Invalid credentials" });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return reply.status(400).send({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = await reply.jwtSign({ id: user.id, role: user.role });

    return reply.send({ token });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
};
