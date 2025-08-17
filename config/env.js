require('dotenv').config();

module.exports = {
  TRIP_SERVICE_URL: process.env.TRIP_SERVICE_URL || 'http://localhost:3002',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};
