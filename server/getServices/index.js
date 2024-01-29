const pool = require('../connection-pool')
const getServices = (req, res) => {

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    const query = `select * from services`;
    connection.query(query, (error, results) => {
      connection.release();

      if (error) {
        console.error('Error executing MySQL query:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      res.json(results);
    });
});

}

module.exports = getServices;