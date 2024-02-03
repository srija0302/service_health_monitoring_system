const pool = require('../connection-pool');

const updateService = (req, res) => {
  const { id, status } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting MySQL connection:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    const updateQuery = 'UPDATE services SET status = ?, timestamp=NOW() WHERE id = ?';
    connection.query(updateQuery, [status, id], (updateError, updateResults) => {
      if (updateError) {
        connection.release();
        console.error('Error updating service status:', updateError);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      const insertQuery = 'INSERT INTO service_logs (service_id,status) VALUES (?,?)';
      connection.query(insertQuery, [id,status], (insertError, insertResults) => {
        connection.release();

        if (insertError) {
          console.error('Error inserting into service_logs:', insertError);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        res.json({ success: true, message: 'Service updated successfully' });
      });
    });
  });
};

module.exports = updateService;
