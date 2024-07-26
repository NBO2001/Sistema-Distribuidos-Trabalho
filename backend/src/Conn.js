import mysql from 'mysql2/promise';


export const ConnectDb1 = async () => {

    try{
        const connection = mysql.createConnection({
            host: 'db1',
            user: 'root',
            port: 3306,
            password: 'db123456',
            database: 'db'
        });
        
        const conn = await connection;

        return conn;
    }
    catch(err){
        throw err;
    }

}

export const ConnectDb2 = async () => {

    try{
        const connection = mysql.createConnection({
            host: 'db2',
            user: 'root',
            port: 3306,
            password: 'db123456',
            database: 'db'
        });
        
        const conn = await connection;

        return conn;
    }
    catch(err){
        throw err;
    }
    
}

export const Conn = async (idDb) => {
    
    if(idDb === 1) return ConnectDb1();
    else if(idDb === 2) return ConnectDb2();
}

