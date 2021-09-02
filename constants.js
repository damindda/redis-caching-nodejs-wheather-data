export default {
    'endpoint': (city) => `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=`,
    'key' : '711914855d389a6b54693a41461b3fa7',
    'redis' : {
        'port': process.env.REDIS_PORT || 6379,
        'host': process.env.REDIS_HOST || '127.0.0.1'
    }
}