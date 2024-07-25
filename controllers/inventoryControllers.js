import { pool } from '../server.js';

export const addInventory = async (req, res) => {
  const { product_id, quantity } = req.body;
  
  if (!product_id || !quantity) {
    return res.status(400).json({ error: "Product ID and quantity are required fields." });
  }

  try {
    const result = await pool.query(
      'INSERT INTO inventory (product_id, quantity) VALUES ($1, $2) RETURNING *',
      [product_id, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23503') { // Foreign key violation
      res.status(400).json({ error: "Product ID does not exist." });
    } else {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
};

export const getAllInventory = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const getInventoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM inventory WHERE inventory_id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Inventory record not found." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const updateInventoryById = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity == null) {
    return res.status(400).json({ error: "Quantity is a required field." });
  }

  try {
    const result = await pool.query(
      'UPDATE inventory SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE inventory_id = $2 RETURNING *',
      [quantity, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Inventory record not found." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const deleteInventoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM inventory WHERE inventory_id = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Inventory record not found." });
    }

    res.status(200).json({ message: "Inventory record deleted successfully.", inventory: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
