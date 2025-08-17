const express = require('express');
const axios = require('axios');
const router = express.Router();

const TRIP_SERVICE_URL = process.env.TRIP_SERVICE_URL || 'http://localhost:3002';

// Lấy danh sách thông báo của user
router.get('/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await axios.get(`${TRIP_SERVICE_URL}/api/notifications/${userId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to get notifications',
      message: error.message 
    });
  }
});

// Đánh dấu thông báo đã đọc
router.patch('/notifications/read/:notificationId', async (req, res) => {
  try {
    const { notificationId } = req.params;
    const response = await axios.patch(`${TRIP_SERVICE_URL}/api/notifications/read/${notificationId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error marking notification as read:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to mark notification as read',
      message: error.message 
    });
  }
});

// Xóa thông báo
router.delete('/notifications/:notificationId', async (req, res) => {
  try {
    const { notificationId } = req.params;
    const response = await axios.delete(`${TRIP_SERVICE_URL}/api/notifications/${notificationId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error deleting notification:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to delete notification',
      message: error.message 
    });
  }
});

module.exports = router;