const redisDB = require("redis")
const redisClient = redisDB.createClient();
redisClient.connect();
redisClient.on("connect" , () => console.log("connect to redis.."));
redisClient.on("ready" , () => console.log("connected to redis.."));
redisClient.on("error" , (err) => console.log("RedisError : " , err));
redisClient.on("end" , () => console.log("disconnected from redis.."));

module.exports = redisClient