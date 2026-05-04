const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

console.log("Config server:", config.server);
console.log("Config user:", config.user);

async function testConnection() {
  try {
    const pool = await sql.connect(config);
    console.log("Connected successfully!");
    pool.close();
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

testConnection();
