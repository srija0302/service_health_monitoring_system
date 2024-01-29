const jwt = require('jsonwebtoken');
const config = require('../config');
const pool = require('../connection-pool')
const secretKey = config.jwtSecretKey;

const getUser = (req, res) => {
    const { email, password } = req.query;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    const query = `select Id,Email from users where Email=? and Password=?`;
    connection.query(query, [email, password],(error, results) => {
      connection.release();

      if (error) {
        console.error('Error executing MySQL query:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
     
      if (results.length > 0) {
        const user = { email, userId: results[0].Id };
        const token = jwt.sign(user, secretKey, { expiresIn: '1h' }); 

        res.json({
            success: true,
            message: 'User authenticated successfully',
            token,
        });
    } else{
      res.status(400).json({success: false, message: 'Email or password is incorrect'})
    }
    
    });
});

}

module.exports = getUser;