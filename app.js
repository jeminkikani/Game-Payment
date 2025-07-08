// app.js
require('dotenv').config();
const express = require('express');
const logger = require('./utils/logger');
const paymentRoutes = require('./routes/paymentRoutes');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Latency Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const latency = Date.now() - start;
    logger.info('API latency', { url: req.originalUrl, latency: `${latency}ms` });
  });
  next();
});

app.use('/api/payments', paymentRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(process.env.PORT, () => logger.info('Server started')))
  .catch(err => logger.error('MongoDB connection error', { error: err.message }));
