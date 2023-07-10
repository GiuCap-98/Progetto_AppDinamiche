const { Pool } = require('pg');

const SECRET = 'asklkdjwqportityakmajdejnekn';
 
// Initialize database connections
const db_rent = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'data_rent',
    password: '1324',
    //password: 'giulisa',
    port: 5432,
});
  
const db_user = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'user_web',
    password: '1324',
    //password: 'giulisa',
    port: 5432,
});
  
module.exports = { db_rent, db_user, SECRET };