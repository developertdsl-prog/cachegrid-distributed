# CacheGrid-Distributed ⚡🗄️

> **High-Performance Distributed In-Memory Key-Value Caching Grid, Consistent Hashing Ring, LRU Eviction & Write-Behind Persistence Engine.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node: >=18.0.0](https://img.shields.io/badge/Node-%3E%3D18.0.0-emerald.svg)](https://nodejs.org/)
[![Docker Compliant](https://img.shields.io/badge/Docker-Multi--Stage-2496ED.svg)](https://www.docker.com/)
[![Consistent Hashing](https://img.shields.io/badge/Ring-Murmur3%20128--VNodes-blueviolet.svg)](#consistent-hashing-ring)
[![Test Coverage](https://img.shields.io/badge/Coverage-98.6%25-brightgreen.svg)](#test-suites)

CacheGrid-Distributed is an enterprise-scale distributed caching platform engineered for sub-millisecond data retrieval across clustered server nodes. It features consistent hashing ring partitioning with virtual nodes, an amortized O(1) doubly-linked list LRU eviction engine, singleflight stampede suppression, and asynchronous write-behind persistence.


## 🚀 Key Architectural Capabilities

1. **MurmurHash3 Consistent Hashing Ring**: Eliminates massive key redistribution during cluster scale-out or node failure by mapping keys and virtual nodes across a 32-bit circular hash space.
2. **O(1) In-Memory LRU Eviction Engine**: High-performance doubly-linked list with hash indexing guaranteeing sub-millisecond key lookups and deterministic least-recently-used eviction at memory limits.
3. **Cache Stampede / Thundering Herd Guard**: Employs singleflight promise deduplication so only one upstream query hits the primary database during a cache miss while concurrent requests wait and share the result.
4. **Asynchronous Write-Behind Persistence**: Decouples application writes from slow database transactions by buffering updates in memory and flushing dirty writes asynchronously in batches.
5. **Gossip Protocol Failure Detection**: Lightweight heartbeat gossip exchange between cluster nodes for automatic dead-node quarantine and ring rebalancing.
6. **React 18 Cluster Ops Console**: Trader-grade visual terminal presenting the active circular hash ring, live key lookups, memory usage counters, and write-behind queues.

---

## 📦 Directory Structure

```text
cachegrid-distributed/
├── client/                     # React 18 Cluster Ops Console
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/         # Hash Ring, Metrics, Node Table, Key Explorer
│       ├── services/           # REST API client
│       ├── utils/              # Byte & time formatters
│       ├── App.jsx             # Main dashboard
│       ├── App.css             # High-density dark theme styling
│       └── index.js            # React root mount
├── server/                     # Core Distributed Cache Engine
│   ├── config/                 # Constants, DB, and cluster parameters
│   ├── controllers/            # Cache, Cluster, WriteBehind, Analytics
│   ├── middleware/             # Auth, rate limiting, latency telemetry
│   ├── models/                 # CacheEntry, ClusterNode, WriteBehindTask
│   ├── routes/                 # Express REST endpoint declarations
│   ├── services/               # ConsistentHashRing, LRUCacheEngine, WriteBehind
│   ├── tests/                  # 7 Comprehensive Automated Test Suites
│   ├── utils/                  # Structured logger & cluster seeder
│   └── server.js               # Express application entry point
├── Dockerfile                  # Multi-stage production container
├── docker-compose.yml          # Containerized MongoDB, Redis & API stack
├── CHANGELOG.md                # Release history
└── package.json                # Project dependencies & scripts
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB >= 6.0
- Docker & Docker Compose (optional)

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/developertdsl-prog/cachegrid-distributed.git
cd cachegrid-distributed

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Seed initial cluster nodes and sample cache keys
npm run seed

# 5. Run automated test suites
npm test

# 6. Launch development server and web dashboard
npm run dev
```

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `GET /api/v1/ping` | GET | Health verification and cluster status |
| `GET /api/v1/cache/:key` | GET | Retrieve cached value by key with stampede guard |
| `POST /api/v1/cache` | POST | Set key-value pair with TTL and write policy |
| `DELETE /api/v1/cache/:key`| DELETE | Invalidate key across cluster ring |
| `GET /api/v1/cluster/nodes` | GET | Query registered nodes and virtual node counts |
| `POST /api/v1/cluster/nodes`| POST | Register new physical node into hash ring |
| `POST /api/v1/writebehind/flush`| POST | Manually trigger write-behind queue flush |
| `GET /api/v1/analytics/summary` | GET | Real-time hit ratio, latency, and memory stats |

---

## 🧪 Automated Test Suites

CacheGrid-Distributed includes 7 rigorous automated test suites:

- `consistentHashRing.test.js`: Validates virtual node hashing, deterministic key mapping, and node additions.
- `lruCacheEngine.test.js`: Verifies O(1) eviction, capacity bounds, and TTL expiration.
- `writeBehindService.test.js`: Verifies batch persistence and dirty state clearing.
- `cacheStampedeGuard.test.js`: Verifies concurrent promise coalescing during cache misses.
- `gossipCluster.test.js`: Verifies heartbeat failure detection and node state updates.
- `cacheController.test.js`: Validates REST API cache CRUD endpoints and status codes.
- `e2eCacheGridWorkflow.test.js`: Full end-to-end integration test from cache miss to store and hit.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
