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
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['https://bus-ticket-fe.vercel.app'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
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
