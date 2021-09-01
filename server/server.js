const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const authApiKey = require('./middleware/authApiKey');
const rateLimiter = require('./middleware/rateLimiter');
const cacheTelemetry = require('./middleware/cacheTelemetry');
const errorHandler = require('./middleware/errorHandler');

// REST API Routes
const cacheRoutes = require('./routes/cacheRoutes');
const clusterRoutes = require('./routes/clusterRoutes');
const writeBehindRoutes = require('./routes/writeBehindRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const { globalRing } = require('./services/consistentHashRing');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));
}

app.use(rateLimiter);
app.use(cacheTelemetry);

// System Health Endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'CacheGrid-Distributed', timestamp: new Date().toISOString() });
});

app.get('/api/v1/ping', (req, res) => {
  res.json({
    status: 'OPTIMAL',
    platform: 'CacheGrid-Distributed In-Memory Engine',
    version: '1.0.0',
    topology: globalRing.getTopology(),
    uptime: process.uptime()
  });
});

// Protected REST Subsystems
app.use('/api/v1/cache', authApiKey, cacheRoutes);
app.use('/api/v1/cluster', authApiKey, clusterRoutes);
app.use('/api/v1/writebehind', authApiKey, writeBehindRoutes);
app.use('/api/v1/analytics', authApiKey, analyticsRoutes);

app.use(errorHandler);

let server;
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    // Initialize default local node into ring
    globalRing.addNode('node-us-east-01');
    server = app.listen(PORT, () => {
      logger.info(`CacheGrid Engine operational on port ${PORT} [Env: ${process.env.NODE_ENV || 'development'}]`);
    });
  });
}

module.exports = app;
