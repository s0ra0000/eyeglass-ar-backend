// controllers/eyeglassController.js
const {
  getAllEyeglasses,
  getEyeglassById,
  createEyeglass,
  updateEyeglass,
  deleteEyeglass,
} = require("../models/eyeglassModel");
const { uploadToS3 } = require("../utils/s3");

const getEyeglasses = async (req, reply) => {
  try {
    const eyeglasses = await getAllEyeglasses();
    return reply.send(eyeglasses);
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

const getEyeglassModel = async (req, reply) => {
  try {
    const id = req.params.id;
    const eyeglass = await getEyeglassById(id);
    if (!eyeglass) {
      return reply.status(404).send({ message: "Eyeglass not found" });
    }
    return reply.send({ model_url: eyeglass.model_url });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

const addEyeglass = async (req, reply) => {
  try {
    // Initialize variables to hold form data
    let name = "";
    let description = "";
    let imageUploadPromise = null;
    let modelUploadPromise = null;

    // Use req.parts() to handle multipart form data
    const parts = req.parts();

    for await (const part of parts) {
      if (part.type === "file") {
        // Handle file uploads
        if (part.fieldname === "image") {
          // Upload image file directly to S3
          imageUploadPromise = uploadToS3(part.filename, part.file);
        } else if (part.fieldname === "model") {
          // Upload model file directly to S3
          modelUploadPromise = uploadToS3(part.filename, part.file);
        } else {
          // Ignore other files
          await part.file.resume();
        }
      } else {
        // Handle regular form fields
        if (part.fieldname === "name") {
          name = part.value;
        } else if (part.fieldname === "description") {
          description = part.value;
        }
      }
    }

    // Wait for both uploads to complete
    const [imageUpload, modelUpload] = await Promise.all([
      imageUploadPromise,
      modelUploadPromise,
    ]);

    // Create a new eyeglass entry in the database
    const newEyeglass = await createEyeglass({
      name,
      description,
      image_url: imageUpload.Location,
      model_url: modelUpload.Location,
    });

    return reply.status(201).send(newEyeglass);
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

const updateEyeglassById = async (req, reply) => {
  try {
    const id = req.params.id;
    const eyeglass = await updateEyeglass(id, req.body);
    return reply.send(eyeglass);
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

const deleteEyeglassById = async (req, reply) => {
  try {
    const id = req.params.id;
    await deleteEyeglass(id);
    return reply.send({ message: "Eyeglass deleted successfully" });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  getEyeglasses,
  getEyeglassModel,
  addEyeglass,
  updateEyeglassById,
  deleteEyeglassById,
};
