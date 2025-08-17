const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer'); 

const { cloudinary ,checkCloudinaryConfig} = require('../utils/cloudiary-utils'); 

const storage = multer.memoryStorage();
  
const upload = multer({
  storage,
  limits: { 
    fileSize: 25 * 1024 * 1024, // 25MB limit
    files: 10, // Maximum 10 files
    fields: 20 // Allow up to 20 non-file fields
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
})

// Hàm upload ảnh lên Cloudinary
const uploadToCloudinary = async (images) => {
  try {
    const uploadPromises = images.map(async (imageBuffer) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'reviews', // Thư mục lưu trữ trên Cloudinary
            quality: 'auto',
            fetch_format: 'auto'
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        ).end(imageBuffer);
      });
    });

    const imgArr = await Promise.all(uploadPromises);
    return imgArr;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload images to Cloudinary');
  }
};


const TRIP_SERVICE_URL = process.env.TRIP_SERVICE_URL || 'http://localhost:3002';

// Create a more flexible upload middleware
const uploadImages = (req, res, next) => {
  const uploadHandler = upload.any(); // Use any() to accept any field names
  
  uploadHandler(req, res, (err) => {
    if (err) {
      if (err.code === 'UNEXPECTED_FIELD' || err.code === 'LIMIT_UNEXPECTED_FILE') {
        // Handle unexpected field error gracefully
        console.log('Unexpected field detected, but continuing...', err.message);
        req.files = req.files || [];
        return next();
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          success: false, 
          message: 'File too large. Maximum size is 25MB.' 
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ 
          success: false, 
          message: 'Too many files. Maximum is 10 files.' 
        });
      }
      // Handle other multer errors
      console.error('Multer error:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'File upload error' 
      });
    }
    
    // Filter files to only include images with the 'images' field name
    if (req.files) {
      req.files = req.files.filter(file => 
        file.fieldname === 'images' && file.mimetype.startsWith('image/')
      );
    }
    
    next();
  });
};

router.post('/create/review', uploadImages, async (req, res) => {
  try {
    const { userId, routeId, rating, comment } = req.body;
    console.log('Received data:', { userId, routeId, rating, comment });
    console.log('Files received:', req.file);

    
    
    let imgArr = [];
    
    // Nếu có file ảnh được upload
    if (req.files && req.files.length > 0) {
      console.log('Uploading images to Cloudinary...');   
      const imageBuffers = req.files.map(file => file.buffer);
      imgArr = await uploadToCloudinary(imageBuffers);
      console.log('Images uploaded successfully:', imgArr);
    }

    const response = await axios.post(`${TRIP_SERVICE_URL}/api/reviews/create`, {
      userId,
      routeId,
      rating,
      comment,
      images: imgArr 
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Error creating review' });
  }
});


router.get('/route/review/:routeId', async (req, res) => {
    try {
        const { routeId } = req.params;
        console.log('Fetching reviews for routeId:', routeId); 
        const response = await axios.get(`${TRIP_SERVICE_URL}/api/reviews/route/review/${routeId}`);
        res.status(response.status).json(response.data);

    } catch (error) {
        console.error('Error fetching reviews by route:', error);
        res.status(500).json({ success: false, message: 'Error fetching reviews by route' });   
    }
});

module.exports = router;