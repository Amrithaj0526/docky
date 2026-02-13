const { Client } = require('pg');
require('dotenv').config();

const createDatabase = async () => {
    const client = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: 5432,
        database: 'postgres', // Connect to default database
    });

    try {
        await client.connect();
        const dbName = process.env.DB_NAME || 'docky';

        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);

        if (res.rowCount === 0) {
            console.log(`Creating database "${dbName}"...`);
            await client.query(`CREATE DATABASE ${dbName}`);
            console.log(`Database "${dbName}" created successfully.`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }
    } catch (error) {
        console.error('Error creating database:', error);
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);
    } finally {
        await client.end();
    }
};

createDatabase();
