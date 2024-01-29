require('dotenv').config();
module.exports = {
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    emailService: process.env.NOTIFICATION_SERVICE,
    emailFromAddress: process.env.NOTIFICATION_FROM_ADDRESS,
    emailToAddress: process.env.NOTIFICATION_TO_ADDRESS,
    emailPassword: process.env.NOTIFICATION_APP_PASSWORD,
    mysqlHost: process.env.MYSQL_HOST,
    mysqlPassword: process.env.MYSQL_PASSWORD,
    mysqlDB: process.env.MYSQL_DB,
    mysqlUser: process.env.MYSQL_USER,
};
