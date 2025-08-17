const express = require('express');
const router = express.Router();
const axios = require('axios');

const TRIP_SERVICE_URL = process.env.TRIP_SERVICE_URL || 'http://localhost:3002';

// Forward GET /api/messages/messages/:userId to Trip_Service
router.get('/messages/:userId', async (req, res) => {
  try {
   
    const { userId } = req.params;
    console.log(`Fetching messages for userId: ${userId}`);
    // Trip_Service chạy ở cổng 3002
    const response = await axios.get(`${TRIP_SERVICE_URL}/api/messages/messages/${userId}`);
    console.log('Received response from Trip_Service:', response.data);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

module.exports = router;
