const express = require('express');
const router = express.Router();
const axios = require('axios');

const TRIP_SERVICE_URL = process.env.TRIP_SERVICE_URL || 'http://localhost:3002';

router.put('/checkout/order/:routeId', async (req, res) => {
    try {
        const { routeId } = req.params;
        console.log('Checking out orders for route ID:', routeId);

        const response = await axios.put(`${TRIP_SERVICE_URL}/api/orders/order/checkout/${routeId}`, {}, {
            headers: { 'Content-Type': 'application/json' }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error checking out orders:', error.message);
        res.status(500).json({ message: "Failed to checkout orders" });
    }
});

// Route to get order by ID from Trip Service
router.get('/order/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log('Getting order by ID:', orderId);
        
        const response = await axios.get(`${TRIP_SERVICE_URL}/api/orders/order/${orderId}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error getting order by ID:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Failed to get order by ID' });
        }
    }
});

// Route to get passenger tickets from Trip Service
router.get('/passenger/:passengerPhone/tickets', async (req, res) => {
    try {
        const { passengerPhone } = req.params;
        const response = await axios.get(`${TRIP_SERVICE_URL}/api/orders/order/phone-search/${passengerPhone}`);
        console.log('Response from Trip Service:', response);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error getting passenger tickets:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Failed to get passenger tickets' });
        }
    }
});

// Route to get contract tickets by phone from Trip Service
router.get('/contract/tickets/phone/:passengerPhone', async (req, res) => {
    try {
        const { passengerPhone } = req.params;
        const response = await axios.get(`${TRIP_SERVICE_URL}/api/trips/contract/tickets/phone/${passengerPhone}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error getting contract tickets by phone:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Failed to get contract tickets by phone' });
        }
    }
});

// Route to get popular routes from Trip Service
router.get('/popular-routes', async (req, res) => {
    try {
        const response = await axios.get(`${TRIP_SERVICE_URL}/api/orders/order/popular-routes`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error getting popular routes:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Failed to get popular routes' });
        }
    }
});

router.post('/payment/create', async (req, res) => {
    try {
        const response = await axios.post(`${TRIP_SERVICE_URL}/api/orders/payment/create`, req.body);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error creating payment:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Failed to create payment' });
        }
    }
});

router.get('/payment/vnpay-return', async (req, res) => {
      try {
        const response = await axios.get(`${TRIP_SERVICE_URL}/api/orders/order/payment/vnpay-return`, { params: req.query });
        res.status(200).json(response.data);
      } catch (error) {
        console.error('Error handling VNPay return:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Failed to handle VNPay return' });
        }
    }
});

router.post('/payment/qr/create', async (req, res) => {
    try {
        const response = await axios.post(`${TRIP_SERVICE_URL}/api/orders/payment/qr/create`, req.body);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error creating QR payment:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Failed to create QR payment' });
        }
    }
});

// Route to check QR payment status
router.get('/payment/qr/status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const response = await axios.get(`${TRIP_SERVICE_URL}/api/orders/payment/qr/status/${orderId}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error checking QR payment status:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Failed to check QR payment status' });
        }
    }
});

// Route to verify QR payment
router.get('/payment/qr/verify', async (req, res) => {
    try {
        const response = await axios.get(`${TRIP_SERVICE_URL}/api/orders/payment/qr/verify`, { params: req.query });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error verifying QR payment:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Failed to verify QR payment' });
        }
    }
});

// Route to set order prepaid status
router.put('/order/set-prepaid/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log('Setting prepaid status for order ID:', orderId);
        
        const response = await axios.put(`${TRIP_SERVICE_URL}/api/orders/order/set-prepaid/${orderId}`, {}, {
            headers: { 'Content-Type': 'application/json' }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error setting prepaid status:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Failed to set prepaid status' });
        }
    }
});


module.exports = router;