import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root', 
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'blog_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Buat connection pool untuk performance lebih baik
const pool = mysql.createPool(dbConfig);

export async function query(sql, params = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    const processedParams = params.map(param => 
      param === undefined ? null : param
    );
    
    const [results] = await connection.execute(sql, processedParams);
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Export pool untuk transaction jika diperlukan
export { pool };