const prisma = require("../config/prisma")

const addFullImageUrls = (products) => {
  if (Array.isArray(products)) {
    return products.map((product) => ({
      ...product,
      image_url: product.image_url || null,
    }));
  } else {
    return {
      ...products,
      image_url: products.image_url || null,
    };
  }
};

//Fungsi model mengambil seluruh produk
exports.getAllProducts = async () => {
  try {
    const products = await prisma.products.findMany({
      orderBy: {
        product_id: "desc", 
      },
    });
    return addFullImageUrls(products);
  } catch (error) {
    throw new Error(`Error fetching products: ${error.message}`);
  }
};

//Ambil produk berdasarkan id
exports.getProductById = async (productId) => {
  try {
    const product = await prisma.products.findUnique({
      where: { product_id: parseInt(productId) },
    });

    if (!product) {
      return null;
    }

    return addFullImageUrls(product);
  } catch (error) {
    throw new Error(`Error fetching product: ${error.message}`);
  }
};

// Create new product
exports.createProduct = async (productData) => {
  try {
    const { name, description, price, stock, image_url = null } = productData;

    const newProduct = await prisma.products.create({
      data: {
        name,
        description,
        price: parseFloat(price), // Ensure price is a number
        stock: parseInt(stock), // Ensure stock is an integer
        image_url,
      },
    });

    return addFullImageUrls(newProduct);
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("Product with this name already exists");
    }
    throw new Error(`Error creating product: ${error.message}`);
  }
};

// Update existing product
exports.updateProduct = async (productId, updateData) => {
  try {
    // Build the data object for Prisma
    const prismaUpdateData = {};

    if (updateData.name !== undefined) prismaUpdateData.name = updateData.name;
    if (updateData.description !== undefined)
      prismaUpdateData.description = updateData.description;
    if (updateData.price !== undefined)
      prismaUpdateData.price = parseFloat(updateData.price);
    if (updateData.stock !== undefined)
      prismaUpdateData.stock = parseInt(updateData.stock);
    if (updateData.image_url !== undefined)
      prismaUpdateData.image_url = updateData.image_url;

    if (Object.keys(prismaUpdateData).length === 0) {
      throw new Error("No fields to update");
    }

    const updatedProduct = await prisma.products.update({
      where: { product_id: parseInt(productId) },
      data: prismaUpdateData,
    });

    return addFullImageUrls(updatedProduct);
  } catch (error) {
    if (error.code === "P2025") {
      // Record not found
      throw new Error("Product not found");
    }
    if (error.code === "P2002") {
      // Unique constraint violation
      throw new Error("Product name already exists");
    }
    throw new Error(`Error updating product: ${error.message}`);
  }
};

// Delete product
exports.deleteProduct = async (productId) => {
  try {
    await prisma.products.delete({
      where: { product_id: parseInt(productId) },
    });
    return true;
  } catch (error) {
    if (error.code === "P2025") {
      // Record not found
      return false;
    }
    throw new Error(`Error deleting product: ${error.message}`);
  }
};

// Get products with pagination
exports.getProductsPaginated = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      prisma.products.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          product_id: "desc",
        },
      }),
      prisma.products.count(),
    ]);

    return {
      products: addFullImageUrls(products),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalProducts: totalCount,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    throw new Error(`Error fetching paginated products: ${error.message}`);
  }
};

// Search products by name or description
exports.searchProducts = async (searchTerm) => {
  try {
    const term = searchTerm?.trim();
    if (!term) {
      // If empty, just return all products
      const all = await prisma.products.findMany({
        orderBy: { name: "asc" },
      });
      return addFullImageUrls(all);
    }

    // Try full-text search first
    const products = await prisma.$queryRaw`
      SELECT 
        p.*,
        MATCH(p.name, p.description) AGAINST (${term} IN NATURAL LANGUAGE MODE) AS relevance
      FROM products AS p
      WHERE MATCH(p.name, p.description) AGAINST (${term} IN NATURAL LANGUAGE MODE)
      ORDER BY relevance DESC
      LIMIT 50;
    `;

    // Fallback: if no fulltext hits, use basic contains
    if (products.length === 0) {
      const fallback = await prisma.products.findMany({
        where: {
          OR: [
            { name: { contains: term } },
            { description: { contains: term } },
          ],
        },
        orderBy: { name: "asc" },
      });
      return addFullImageUrls(fallback);
    }

    return addFullImageUrls(products);
  } catch (error) {
    throw new Error(`Error searching products: ${error.message}`);
  }
};
// Update product stock
exports.updateProductStock = async (productId, newStock) => {
  try {
    const updatedProduct = await prisma.products.update({
      where: { product_id: parseInt(productId) },
      data: { stock: parseInt(newStock) },
    });

    return addFullImageUrls(updatedProduct);
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("Product not found");
    }
    throw new Error(`Error updating product stock: ${error.message}`);
  }
};

// Clean up function to disconnect Prisma
exports.disconnect = async () => {
  await prisma.$disconnect();
};
