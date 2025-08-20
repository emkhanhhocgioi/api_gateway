const express =require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const AI_BOT_URL = process.env.AI_BOT_URL;
console.log('AI Bot URL:', AI_BOT_URL);

router.get('/chatbot/:query', async (req, res) => {
    const { query } = req.params;
    console.log('Chatbot query received:', query);

    try {
        const response = await axios.get(`${AI_BOT_URL}/routes`, {
            params: { query: query }
        });
        // send only the response payload (no circular refs)
        console.log('Response from AI Bot:', response.data);
        res.json(response.data);
    } catch (error) {
        // better error details for debugging
        if (error.response) {
            console.error('External API responded with error:', error.response.status, error.response.data);
            return res.status(error.response.status).json({ error: error.response.data });
        }
        console.error('Error calling external API:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from external API' });
    }
});

module.exports = router;