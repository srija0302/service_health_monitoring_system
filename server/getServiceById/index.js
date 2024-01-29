const pool = require('../connection-pool')
const getServiceById = (req, res) => {
    const { id } = req.query;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    const query = `select s.id, name,sl.status, sl.timestamp from services s inner join service_logs sl on s.id=sl.service_id where s.id=?`;
    connection.query(query, [id], (error, results) => {
      connection.release();

      if (error) {
        console.error('Error executing MySQL query:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      res.json(results);
    });
});

}

module.exports = getServiceById;