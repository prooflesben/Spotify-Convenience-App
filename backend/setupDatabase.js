const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runSqlFile(filePath, connection) {
    const sql = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const statements = sql.split(/;\s*$/m); // Split the file into individual statements

    for (const statement of statements) {
        if (statement.trim()) {
            await connection.query(statement);
        }
    }
}

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'your_password',
        database: 'your_database'
    });

    try {
        await runSqlFile(path.join(__dirname, 'setup.sql'), connection);
        console.log('Database setup completed successfully.');
    } catch (error) {
        console.error('Error setting up the database:', error);
    } finally {
        await connection.end();
    }
}

setupDatabase();
