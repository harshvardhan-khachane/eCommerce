import { pool } from '../server.js';

export const addProduct = async (req, res) => {
  const { name, description, price, discount_percentage, rating, stock, category_id } = req.body;

  if (!name || !price || !stock) {
    return res.status(400).json({ error: "Name, price, and stock are required fields." });
  }
  console.log(req.body);

  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, discount_percentage, rating, stock, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, price, discount_percentage, rating, stock, category_id]
    );
    console.log(result);
    res.status(201).json(result.rows);
  } catch (error) {
    if (error.code) {
      switch (error.code) {
        case '23505': // Unique violation
          res.status(400).json({ error: "Product with the same name already exists." });
          break;
        case '23503': // Foreign key violation
          res.status(400).json({ error: "Category ID does not exist." });
          break;
        default:
          res.status(500).json({ error: "Database error", details: error.message });
      }
    } else {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
};



export const updateProducts = async (req, res) => {
  const { name, description, price, discount_percentage, rating, stock, category_id } = req.body;
  const{id} = req.params;

  try {
    const result = await pool.query(

      `UPDATE products SET 
    name = $1,
    description = $2,
    price = $3,
    discount_percentage = $4,
    rating = $5,
    stock = $6,
    category_id = $7
WHERE 
    product_id = $8
RETURNING *`,
      [name, description, price, discount_percentage, rating, stock, category_id, id]
    );
    console.log(result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code) {
      switch (error.code) {
        case '23505': // Unique violation
          res.status(400).json({ error: "Product with the same name already exists." });
          break;
        case '23503': // Foreign key violation
          res.status(400).json({ error: "Category ID does not exist." });
          break;
        default:
          res.status(500).json({ error: "Database error", details: error.message });
      }
    } else {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
}


export const getByID = async (req, res) => {
  try {

    const id = req.params.id
    console.log(id);
    if (!id) {
      return res.status(404).send({
        success: false,
        message: 'Invalid Or Provide Product id'
      })
    }
    
    const result = await pool.query(
      'SELECT * FROM products WHERE product_id = $1',
      [id]
    );

    console.log(result);

    if (!result) {
      return res.status(404).send({
        success: false,
        message: 'no Records found'
      })
    }
    res.status(200).send({
      success: true,
      productDetail: result.rows[0],
    });
    // res.send(result[0]);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error in getting product detail with id',
      error
    })
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export const deleteProductById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM products WHERE product_id = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully.", product: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};