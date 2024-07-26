import { Conn } from "../Conn.js";

const getAllDb1 = async () => {
  try {
    const conn = await Conn(1);
    const [data] = await conn.query("SELECT * FROM songs;");
    await conn.close(); 
    return data.map(record => ({ ...record, from: "bd1" }));
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getAllDb2 = async () => {
  try {
    const conn = await Conn(2);
    const [data] = await conn.query("SELECT * FROM songs;");
    await conn.close(); 
    return data.map(record => ({ ...record, from: "bd2" }));

  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getAll = async (dbFlag) => {
  if (dbFlag === 1) {
    return getAllDb1();
  } else if (dbFlag === 2) {
    return getAllDb2();
  } else if (dbFlag === 3) {
    const data1 = await getAllDb1();
    const data2 = await getAllDb2();
    return data1.concat(data2);
  } else {
    return [];
  }
};


const insertIntoDb1 = async (title) => {
    try {
      const conn = await Conn(1);
      await conn.query("INSERT INTO songs (title) VALUES (?);", [title]);
      await conn.close(); 
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  
  const insertIntoDb2 = async (title) => {
    try {
      const conn = await Conn(2);
      await conn.query("INSERT INTO songs (title) VALUES (?);", [title]);
      await conn.close();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  
  export const insert = async (title, dbFlag) => {
    if (dbFlag === 1) {
      return insertIntoDb1(title);
    } else if (dbFlag === 2) {
      return insertIntoDb2(title);
    } else if (dbFlag === 3) {
      const result1 = await insertIntoDb1(title);
      const result2 = await insertIntoDb2(title);
      return result1 && result2;
    } else {
      return false;
    }
  };