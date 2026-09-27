import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'aishagazez',
  host: 'localhost',
  database: 'aishagazez', 
  password: '',
  port: 5432,
});

export default pool;