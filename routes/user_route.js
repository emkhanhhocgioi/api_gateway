const express = require('express');
const router = express.Router();
const axios = require('axios');

const TRIP_SERVICE_URL = process.env.TRIP_SERVICE_URL || 'http://localhost:3002';


router.get('/test', async (req, res) => {
    try {
        const response = await axios.get(`${TRIP_SERVICE_URL}/api/users/test`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

    
);

router.post('/login', async (req, res) => {
    try {
        const { loginparam, password } = req.body;
        console.log('Login parameters:',
            { loginparam, password });
        const response = await axios.post(`${TRIP_SERVICE_URL}/api/users/login`, { loginparam, password }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 200) {
            return res.status(response.status).json({ error: 'Failed to log in' });
        }
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({ error: error.message });
    }
});

router.post('/createuser', async (req,res) => {
    try {
        const items = req.body;
        console.log('Received items:', items);
        const response = await axios.post(`${TRIP_SERVICE_URL}/api/users/create/user`, {items:items}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 201) {
            return res.status(response.status).json({ error: 'Failed to create user' });
        }
        res.status(response.status).json(response.data);
    } catch (error) {
      
        res.status(error.response ? error.response.status : 500).json({ error: error.message });
    }


});
    
router.post('/create/partner', async (req, res) => {
    try {
        const items = req.body;
        console.log('Received partner items:', items);
        const response = await axios.post(`${TRIP_SERVICE_URL}/api/users/create/partner`, { items: items }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 201) {
            return res.status(response.status).json({ error: 'Failed to create partner' });
        }
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({ error: error.message });
    }
});

router.post('/login/partner', async (req, res) => {
    try {
        const { loginparam, password } = req.body;
        console.log('Partner login parameters:', { loginparam, password });
        const response = await axios.post(`${TRIP_SERVICE_URL}/api/users/login/partner`,
            { loginparam, password }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if (response.status !== 200) {
            return res.status(response.status).json({ error: 'Failed to log in partner' });
        }
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({ error: error.message });
    }
});

        

module.exports = router;