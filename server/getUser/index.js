const jwt = require('jsonwebtoken');
const config = require('../config');
const pool = require('../connection-pool')
const bcrypt = require('bcrypt');
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

    const query = `select Id,Email, Password from users where Email=?`;
    connection.query(query, [email], (error, results) => {
      connection.release();
      const plainTextPassword = password;
      if (error) {
        console.error('Error executing MySQL query:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      if (results.length > 0) {
        bcrypt.compare(plainTextPassword, results[0].Password, (err, result) => {
          if (result) {
            const user = { email, userId: results[0].Id };
            const token = jwt.sign(user, secretKey, { expiresIn: '1h' });

            res.json({
              success: true,
              message: 'User authenticated successfully',
              token,
            });
          } else {
            res.status(401).json({ success: false, message: 'Password is incorrect' })
          }
        });

      } else {
        res.status(401).json({ success: false, message: 'Email is incorrect' })
      }

    });
  });

}

module.exports = getUser;