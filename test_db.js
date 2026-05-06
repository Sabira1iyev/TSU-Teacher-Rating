const { getDb } = require("./src/lib/db");

async function run() {
  const pool = await getDb();
  try {
    const result = await pool.request().query("sp_help 'Reviews'");
    console.dir(result.recordsets, { depth: null });
    
    // Also try to insert a fake review that might fail and log the error.
  } catch (err) {
    console.error("Error:", err);
  } finally {
      process.exit(0);
  }
}

run();
