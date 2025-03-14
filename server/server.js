const express = require("express");
const cors = require("cors");
const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

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

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
