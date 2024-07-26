import { Conn } from "../Conn.js";
import { v4 as uuidv4 } from 'uuid';

const getAllDb1 = async () => {
  try {
    const conn = await Conn(1);
    const [data] = await conn.query("SELECT * FROM songs;");
    await conn.close();
    return data.map(record => ({ ...record, from: ["db1"] }));
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
    return data.map(record => ({ ...record, from: ["db2"] }));
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
    const combined = [...data1];

    data2.forEach(record2 => {
      const match = combined.find(record1 => record1.id === record2.id);
      if (match) {
        match.from.push("db2");
      } else {
        combined.push(record2);
      }
    });

    return combined;
  } else {
    return [];
  }
};

const insertIntoDb1 = async ({id, title}) => {
  try {
    const conn = await Conn(1);
    await conn.query("INSERT INTO songs (id, title) VALUES (?,?);", [id, title]);
    await conn.close(); 
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const insertIntoDb2 = async ({id, title}) => {
  try {
    const conn = await Conn(2);
    await conn.query("INSERT INTO songs (id, title) VALUES (?,?);", [id, title]);
    await conn.close();
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const insert = async (title, dbFlag) => {
  const id = uuidv4();
  let from = []
  try {
    if (dbFlag === 1) {
      await insertIntoDb1({id, title});
      from.push('db1');
    } else if (dbFlag === 2) {
      await insertIntoDb2({id, title});
      from.push('db2');
    } else if (dbFlag === 3) {
      await insertIntoDb1({id, title});
      from.push('db1');
      await insertIntoDb2({id, title});
      from.push('db2');
    } else {
      return { id: null };
    }
    return { id, title, from };
  } catch (err) {
    console.log(err);
    return { id: null, title: null, from: [] };
  }
};


const deleteFromDb1 = async (id) => {
  try {
    const conn = await Conn(1);
    await conn.query("DELETE FROM songs WHERE id = ?;", [id]);
    await conn.close();
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
};


const deleteFromDb2 = async (id) => {
  try {
    const conn = await Conn(2);
    await conn.query("DELETE FROM songs WHERE id = ?;", [id]);
    await conn.close();
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteSong = async (id, dbFlag) => {
  try {
    if (dbFlag === 1) {
      await deleteFromDb1(id);
    } else if (dbFlag === 2) {
      await deleteFromDb2(id);
    } else if (dbFlag === 3) {
      await deleteFromDb1(id);
      await deleteFromDb2(id);
    } else {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
