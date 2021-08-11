# Changelog - CacheGrid-Distributed

All notable changes to this project are documented chronologically in accordance with [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2021-12-24
### Added
- Enterprise Consistent Hashing Ring utilizing MurmurHash3 with 128 virtual nodes per physical host.
- High-efficiency in-memory LRU doubly-linked list engine with amortized O(1) reads, writes, and evictions.
- Asynchronous Write-Behind persistence buffer flushing dirty entries to backing database.
- Singleflight concurrency lock mitigating thundering herd and cache stampede effects on cache misses.
- React 18 Visual Cluster Topology Console with real-time hash ring visualizer and hit-ratio telemetry.

## [0.8.0] - 2021-11-12
### Added
- Gossip-based cluster membership heartbeat for automated node failure detection and ring rebalancing.
- MGET batch query endpoint with concurrent multi-node fanout.

## [0.5.0] - 2021-09-20
### Added
- TTL expiration daemon with lazy eviction on key read and active background scanning.
- Write-behind transaction queue with exponential backoff on DB persistence failure.

## [0.2.0] - 2021-08-16
### Added
- Initial consistent hashing ring implementation and node partition assignment.
- Rate limiting and API security authorization middleware.

## [0.1.0] - 2021-07-01
### Initial
- Core project scaffolding, Mongoose schemas, Docker orchestration, and initial architectural specifications.
