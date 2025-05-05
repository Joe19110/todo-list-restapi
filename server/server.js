const express = require("express");
const cors = require("cors");
const axios = require("axios");
const crypto = require("crypto");
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Cloudinary config
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Sequelize
const db = require('./models');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/upload', require('./routes/upload'));

// Cloudinary delete route
app.post("/delete-image", async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: "No public_id provided" });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = crypto
    .createHash("sha1")
    .update(`public_id=${public_id}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
    .digest("hex");

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        public_id,
        timestamp,
        api_key: CLOUDINARY_API_KEY,
        signature,
      }
    );

    console.log("Cloudinary response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Cloudinary deletion failed:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Cloudinary deletion failed" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Connect to DB and start server
db.sequelize.sync().then(() => {
  console.log('Database connected successfully');
  app.listen(5000, () => {
    console.log("Server running on port 5000");
    console.log("Available routes:");
    console.log("- POST /api/auth/register");
    console.log("- POST /api/auth/login");
    console.log("- GET /api/users/:userId");
    console.log("- GET /api/tasks");
    console.log("- POST /api/upload");
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
