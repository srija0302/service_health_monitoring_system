const registerUser = require('./registerUser');
const getUser = require('./getUser');
const getServices = require('./getServices');
const cors = require('cors');
const express = require('express');
const getServiceById = require('./getServiceById');
const updateService = require('./updateService');
const searchService = require('./searchService');
const emailNotifications = require('./emailNotifications');
const verifyToken = require('./verifyToken');
const app = express();
const port = 3001;
app.use(cors()); 
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/register-user',registerUser);
app.get('/get-user', getUser);
app.get('/get-services',verifyToken, getServices);
app.get('/get-service-by-id',verifyToken, getServiceById);
app.post('/update-service', verifyToken, updateService);
app.get('/search-service', verifyToken, searchService);
app.post('/email-notification',verifyToken, emailNotifications);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});