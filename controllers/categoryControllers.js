import { pool } from '../server.js';

export const addCategory = async (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "Name is a required field." });
  }

  try {
    const result = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM categories WHERE category_id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const updateCategoryById = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is a required field." });
  }

  try {
    const result = await pool.query(
      'UPDATE categories SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE category_id = $3 RETURNING *',
      [name, description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const deleteCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM categories WHERE category_id = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json({ message: "Category deleted successfully.", category: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
