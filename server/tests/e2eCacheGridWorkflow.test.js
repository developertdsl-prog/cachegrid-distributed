const request = require('supertest');
const app = require('../server');

describe('E2E CacheGrid API Integration Test Suite', () => {
  test('GET /api/v1/ping returns optimal health status and ring topology', async () => {
    const res = await request(app).get('/api/v1/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OPTIMAL');
    expect(res.body.platform).toContain('CacheGrid');
  });

  test('GET /health returns basic liveness response', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });
});
