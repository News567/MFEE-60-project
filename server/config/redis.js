import { createClient } from 'redis';

const redisClient = createClient({
  // 預設配置，如果有特殊需求可以調整
  url: 'redis://localhost:6379'
});

redisClient.on('error', err => console.log('Redis Client Error', err));

// 連接到 Redis
await redisClient.connect();

export default redisClient;