const pool = require('../connection-pool')

const searchService = (req, res) => {
  const { searchDate } = req.query;

  if (!searchDate) {
    return res.status(400).json({ success: false, message: 'searchDate is required' });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    const searchTerm = searchDate.substring(0, 10);
    const currentDate = new Date(searchTerm);
    currentDate.setHours(currentDate.getHours() + 5);
    currentDate.setMinutes(currentDate.getMinutes() + 30);
    currentDate.setHours(23);
    currentDate.setMinutes(59);
    const query = `
    SELECT s.id, s.name, sl_max.timestamp , s.status
    FROM services s
    JOIN (
        SELECT service_id, MAX(timestamp) AS timestamp
        FROM service_logs
        WHERE status = 'down' AND timestamp BETWEEN DATE_SUB(?, INTERVAL 30 DAY) AND ?
        GROUP BY service_id
    ) sl_max ON s.id = sl_max.service_id`;
    connection.query(query, [currentDate, currentDate], (error, results) => {
      connection.release();

      if (error) {
        console.error('Error executing MySQL query:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      res.json(results);
    });
  });

}

module.exports = searchService;