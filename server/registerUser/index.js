const pool = require('../connection-pool');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const registerUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    const plainTextPassword = password;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        console.error(err);
        return;
      }
      bcrypt.hash(plainTextPassword, salt, (err, hash) => {
        if (err) {
          console.error(err);
          return;
        }

        const query = 'INSERT INTO users (Email, Password) VALUES (?, ?)';
        connection.query(query, [email, hash], (error, results) => {

          connection.release();

          if (error) {
            console.error('Error executing MySQL query:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
          }
          if (results) {
            res.json({ success: true, message: 'User registered successfully' });
          }
        });
      });
    });

  });

}

module.exports = registerUser;