import { pool } from '../server.js';

export const addProductImages = async (req, res) => {
  const { product_id } = req.body;
  const images = req.files;

  if (!product_id || !images || images.length === 0) {
    return res.status(400).json({ error: "Product ID and images are required fields." });
  }

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const imageInsertPromises = images.map(image => {
        const imageBuffer = image.buffer;
        return client.query(
          'INSERT INTO product_images (product_id, image) VALUES ($1, $2) RETURNING *',
          [product_id, imageBuffer]
        );
      });

      const results = await Promise.all(imageInsertPromises);

      await client.query('COMMIT');

      res.status(201).json(results.map(result => result.rows[0]));
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: "Server error", details: error.message });
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Function to get all images for a specific product
export const getProductImages = async (req, res) => {
    const { product_id } = req.params;
  
    if (!product_id) {
      return res.status(400).json({ error: "Product ID is a required field." });
    }
  
    try {
      const result = await pool.query(
        'SELECT * FROM product_images WHERE product_id = $1',
        [product_id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "No images found for this product." });
      }
  
      // If you want to send the images as separate files, you can iterate over the result and send them as individual files
      const images = result.rows.map(row => ({
        image_id: row.image_id,
        product_id: row.product_id,
        image: row.image.toString('base64'), // Convert to base64 to send as JSON
        created_at: row.created_at
      }));
  
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
};

export const getProductImageById = async (req, res) => {
    const { product_id, image_id } = req.params;
  
    if (!product_id || !image_id) {
      return res.status(400).json({ error: "Product ID and Image ID are required fields." });
    }
  
    try {
      const result = await pool.query(
        'SELECT image FROM product_images WHERE product_id = $1 AND image_id = $2',
        [product_id, image_id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "No image found for this product." });
      }
  
      const image = result.rows[0].image;
  
      res.writeHead(200, {
        'Content-Type': 'image/jpeg', // Adjust if your images are in a different format
        'Content-Length': image.length
      });
      res.end(image);
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
};

export const getProductImageIds = async (req, res) => {
    const { product_id } = req.params;
  
    if (!product_id) {
      return res.status(400).json({ error: "Product ID is a required field." });
    }
  
    try {
      const result = await pool.query(
        'SELECT image_id FROM product_images WHERE product_id = $1',
        [product_id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "No images found for this product." });
      }
  
      res.status(200).json(result.rows.map(row => row.image_id));
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
};