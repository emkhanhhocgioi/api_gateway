require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const limiter = require('./midlewares/ratelimits');
const app = express();

const router = require('./routes/user_route') ;
const triprouter = require('./routes/partner_routes');
const orderrouter = require('./routes/order_routes');
const reviewrouter = require('./routes/review_routes');
const notificationrouter = require('./routes/notifications_routes');
const messageRouter = require('./routes/message_routes');

// CORS config
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://bus-ticket-fe.vercel.app'],
  credentials: true
}));

app.use(express.json());
app.use(limiter);
app.use('/api',
  router,
  triprouter,
  orderrouter,
  reviewrouter,
  notificationrouter,
  messageRouter
);


app.get('/', (req, res) => {
  res.send('API Gateway');
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Trip Service URL: ${process.env.TRIP_SERVICE_URL || 'http://localhost:3002'}`);
});
