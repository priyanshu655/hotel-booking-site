const { Redis } = require("@upstash/redis");

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_TOKEN;

let redisClient = null;

if (redisUrl && redisToken) {
	redisClient = new Redis({
		url: redisUrl,
		token: redisToken,
	});
}

module.exports = redisClient;
