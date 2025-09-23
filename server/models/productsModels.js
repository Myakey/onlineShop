const db = require("../config/database");

const getBaseUrl = () => {
  return process.env.BASE_URL || 'http://localhost:8080';
};

const addFullImageUrls = (products) => {
  const baseUrl = getBaseUrl();
    
  if (Array.isArray(products)) {
    return products.map(product => ({
      ...product,
      image_url: product.image_url ? `${baseUrl}${product.image_url}` : null
    }));
  } else {
    return {
      ...products,
      image_url: products.image_url ? `${baseUrl}${products.image_url}` : null
    };
  }
};

//Should be only data layering only no https handling here
exports.getAllProducts = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    return addFullImageUrls(rows);
  } catch (err) {
    throw err;
  }
};

exports.createProduct = async (productData) => {
  try {
    const { name, description, price, stock, image_url = null } = productData;
    
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, stock, image_url]
    );
    
    const newProduct = {
      id: result.insertId,
      name,
      description,
      price,
      stock,
      image_url
    };
    
    return addFullImageUrls(newProduct);
  } catch (err) {
    throw err;
  }
};

exports.deleteProduct = async (productId) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE product_id = ?', [productId]);
    return result.affectedRows > 0;
  } catch (err) {
    throw err;
  }
}