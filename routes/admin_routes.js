const express = require('express');
const axios = require('axios');
const { TRIP_SERVICE_URL } = require('../config/env');
const { verifyAdminToken, checkPermission, requireSuperAdmin } = require('../midlewares/admin_auth');

const router = express.Router();

// Helper function to forward headers (especially Authorization)
const getForwardHeaders = (req) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Forward authorization header if present
  if (req.headers.authorization) {
    headers.Authorization = req.headers.authorization;
  }
  
  return headers;
};

// Helper function to handle axios errors
const handleAxiosError = (error, res) => {
  console.error('Admin API error:', error.message);
  const status = error.response ? error.response.status : 500;
  const message = error.response ? error.response.data : { error: 'Internal Server Error' };
  res.status(status).json(message);
};

// ===== AUTHENTICATION ROUTES =====
router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
 
    const response = await axios.post(`${TRIP_SERVICE_URL}/api/admin/login`, {email, password}, {
      headers: getForwardHeaders(req)
    });
    console.log('Admin login response:', response);
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

router.post('/create', verifyAdminToken, requireSuperAdmin, async (req, res) => {
  try {
    const response = await axios.post(`${TRIP_SERVICE_URL}/api/admin/create`, req.body, {
      headers: getForwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

// ===== DASHBOARD ROUTES =====
router.get('/dashboard', verifyAdminToken, async (req, res) => {
  try {
    const response = await axios.get(`${TRIP_SERVICE_URL}/api/admin/dashboard`, {
      headers: getForwardHeaders(req)
    });
    console.log('Dashboard stats response:', response.data);
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

// ===== USER MANAGEMENT ROUTES =====
router.get('/users', verifyAdminToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const url = `${TRIP_SERVICE_URL}/api/admin/users${queryString ? `?${queryString}` : ''}`;
    const response = await axios.get(url, {
      headers: getForwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

router.get('/users/:userId', verifyAdminToken, async (req, res) => {
  try {
    const response = await axios.get(`${TRIP_SERVICE_URL}/api/admin/users/${req.params.userId}`, {
      headers: getForwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

router.patch('/users/:userId/status', verifyAdminToken, async (req, res) => {
  try {
    const response = await axios.patch(`${TRIP_SERVICE_URL}/api/admin/users/${req.params.userId}/status`, req.body, {
      headers: getForwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

router.delete('/users/:userId', verifyAdminToken, requireSuperAdmin, async (req, res) => {
  try {
    const response = await axios.delete(`${TRIP_SERVICE_URL}/api/admin/users/${req.params.userId}`, {
      headers: getForwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

// ===== PARTNER MANAGEMENT ROUTES =====
router.get('/partners', verifyAdminToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const url = `${TRIP_SERVICE_URL}/api/admin/partners${queryString ? `?${queryString}` : ''}`;
    const response = await axios.get(url, {
      headers: getForwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

router.get('/partners/:partnerId', verifyAdminToken, async (req, res) => {
  try {
    const response = await axios.get(`${TRIP_SERVICE_URL}/api/admin/partners/${req.params.partnerId}`, {
      headers: getForwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

router.patch('/partners/:partnerId/verify', verifyAdminToken, async (req, res) => {
  try {
    const response = await axios.patch(`${TRIP_SERVICE_URL}/api/admin/partners/${req.params.partnerId}/verify`, req.body, {
      headers: getForwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

// ===== ORDER MANAGEMENT ROUTES =====
router.get('/orders', verifyAdminToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const url = `${TRIP_SERVICE_URL}/api/admin/orders${queryString ? `?${queryString}` : ''}`;
    const response = await axios.get(url, {
      headers: getForwardHeaders(req)
    });
    console.log('Orders response:', response.data);
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

router.get('/orders/:orderId', verifyAdminToken, async (req, res) => {
  try {
    const response = await axios.get(`${TRIP_SERVICE_URL}/api/admin/orders/${req.params.orderId}`, {
      headers: getForwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

// ===== REVIEW MANAGEMENT ROUTES =====
router.get('/reviews', verifyAdminToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const url = `${TRIP_SERVICE_URL}/api/admin/reviews${queryString ? `?${queryString}` : ''}`;
    const response = await axios.get(url, {
      headers: getForwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

router.patch('/reviews/:reviewId/approve', verifyAdminToken, async (req, res) => {
  try {
    const response = await axios.patch(`${TRIP_SERVICE_URL}/api/admin/reviews/${req.params.reviewId}/approve`, req.body, {
      headers: getForwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

// ===== ROUTE MANAGEMENT ROUTES =====
router.get('/routes', verifyAdminToken, async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const url = `${TRIP_SERVICE_URL}/api/admin/routes${queryString ? `?${queryString}` : ''}`;
    const response = await axios.get(url, {
      headers: getForwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

router.patch('/routes/:routeId/status', verifyAdminToken, async (req, res) => {
  try {
    const response = await axios.patch(`${TRIP_SERVICE_URL}/api/admin/routes/${req.params.routeId}/status`, req.body, {
      headers: getForwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

// ===== TICKET MANAGEMENT ROUTES =====
router.get('/tickets', verifyAdminToken,  async (req, res) => {
  try {
    const queryString = new URLSearchParams(req.query).toString();
    const url = `${TRIP_SERVICE_URL}/api/admin/tickets${queryString ? `?${queryString}` : ''}`;
    const response = await axios.get(url, {
      headers: getForwardHeaders(req)
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res);
  }
});

module.exports = router;