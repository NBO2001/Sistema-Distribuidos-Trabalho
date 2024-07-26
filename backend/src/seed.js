import { Conn } from "./Conn.js";

(async () => {
  try {
    let conn = await Conn(1);
    
    await conn.query(`
      CREATE TABLE IF NOT EXISTS songs (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL
      );
    `);
    
    console.log("Table 'songs' created successfully.");
    await conn.close();

    conn = await Conn(2);
    
    await conn.query(`
      CREATE TABLE IF NOT EXISTS songs (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL
      );
    `);
    
    console.log("Table 'songs' created successfully.");
    await conn.close();
    return;
  } catch (err) {
    console.error("Error creating table 'songs':", err);
  }
})();
