const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const config = require('./config');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://localhost:3000',
      config.DB_TEST_HOST,
      config.FRONTEND_URL
    ].filter(Boolean);
   
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API Routes
app.use('/api', routes);

// Error Handler (debe ir al final)
app.use(errorHandler);

module.exports = app;