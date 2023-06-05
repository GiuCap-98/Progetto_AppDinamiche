const { Pool } = require('pg');

async function configureDB() {
  // Initialize database connections
  const pool_rent = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'data_rent',
    //password: '1324',
    password: 'giulisa',
    port: 5432,
  });
  /*
  const pool_user = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'user_web',
    password: '1324',
    port: 5432,
  });
  */

  // Test the database connections
  try {
    await pool_rent.query('SELECT 1');
    //await pool_user.query('SELECT 1');
    console.log('Database connections established');
  } catch (error) {
    console.error('Failed to connect to databases:', error);
  }

  return { db_rent: pool_rent };
  // return { db_rent: pool_rent, db_user: pool_user };
}

// Export database connection
module.exports = { configureDB };
