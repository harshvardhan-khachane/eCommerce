import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;



const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log("Connected to the database");
        client.release();
    } catch (err) {
        console.error("Database connection error:", err.stack);
    }
}

testConnection();

app.use("/api/v1", productRoutes);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export { pool };