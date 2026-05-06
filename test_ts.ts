import { getDb } from "./src/lib/db";

async function run() {
  const pool = await getDb();
  try {
    const result = await pool.request().query("sp_help 'Reviews'");
    console.log(result.recordsets[1]); // The columns
    
    // Also log constraints
    const constraints = await pool.request().query("SELECT * FROM sys.key_constraints WHERE parent_object_id = OBJECT_ID('Reviews')");
    console.log("Constraints:", constraints.recordset);

    const indexes = await pool.request().query("sp_helpindex 'Reviews'");
    console.log("Indexes:", indexes.recordset);
  } catch (err) {
    console.error("Error:", err);
  } finally {
      process.exit(0);
  }
}

run();
