import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root', // ganti dengan username MySQL kamu
  password: '', // ganti dengan password MySQL kamu
  database: 'blog_app'
};

export async function query(sql, params = []) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    // ✅ Handle undefined parameters
    const processedParams = params.map(param => 
      param === undefined ? null : param
    );
    
    const [results] = await connection.execute(sql, processedParams);
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}