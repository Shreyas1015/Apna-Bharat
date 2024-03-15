require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});

pool.connect((err) => {
  if (err) {
    console.error(`Error connecting to Database ${err}`);
  } else {
    console.log(`Connected to ${process.env.DB_NAME} Database`);
  }
});

module.exports = pool;
