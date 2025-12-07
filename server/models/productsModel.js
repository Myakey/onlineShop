//product model
const prisma = require("../config/prisma")

const addFullImageUrls = (products) => {
  if (Array.isArray(products)) {
    return products.map((product) => ({
      ...product,
      images: product.images || [],
      primary_image: product.images?.find(img => img.is_primary)?.image_url || null,
    }));
  } else {
    return {
      ...products,
      images: products.images || [],
      primary_image: products.images?.find(img => img.is_primary)?.image_url || null,
    };
  }
};

//Fungsi model mengambil seluruh produk
exports.getAllProducts = async () => {
  try {
    const products = await prisma.products.findMany({
      include: {
        images: {
          where: { is_primary: true },
          take: 1,
        },
      },
      orderBy: {
        product_id: "desc", 
      },
    });
    return addFullImageUrls(products);
  } catch (error) {
    throw new Error(`Error fetching products: ${error.message}`);
  }
};

exports.getProductById = async (productId) => {
  try {
    const product = await prisma.products.findUnique({
      where: { product_id: parseInt(productId) },
      include: {
        images: true, // Get all images
      },
    });

    if (!product) {
      return null;
    }

    return addFullImageUrls(product);
  } catch (error) {
    throw new Error(`Error fetching product: ${error.message}`);
  }
};

//Create new product
exports.createProduct = async (productData) => {
  try {
    const { name, description, price, stock, images = [], weight, length, width, height } = productData;

    const newProduct = await prisma.products.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        weight,
        length,
        width,
        height
      },
    });

    // Add images if provided
    if (images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((img, index) => ({
          product_id: newProduct.product_id,
          image_url: img.url,
          is_primary: index === 0, // First image is primary
        })),
      });
    }

    // Fetch product with images
    const productWithImages = await prisma.products.findUnique({
      where: { product_id: newProduct.product_id },
      include: { images: true },
    });

    return addFullImageUrls(productWithImages);
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("Product with this name already exists");
    }
    throw new Error(`Error creating product: ${error.message}`);
  }
};

// Update product with partial image update
exports.updateProduct = async (productId, updateData) => {
  try {
    const { name, description, price, stock, images } = updateData;

    const prismaUpdateData = {};

    if (name !== undefined) prismaUpdateData.name = name;
    if (description !== undefined) prismaUpdateData.description = description;
    if (price !== undefined) prismaUpdateData.price = parseFloat(price);
    if (stock !== undefined) prismaUpdateData.stock = parseInt(stock);

    // Update only product fields first
    const updatedProduct = await prisma.products.update({
      where: { product_id: parseInt(productId) },
      data: prismaUpdateData,
    });

    // -----------------------------------
    // PARTIAL IMAGE UPDATE LOGIC
    // -----------------------------------
    if (images) {
      // 1. Delete specific images
      if (images.delete && images.delete.length > 0) {
        await prisma.productImage.deleteMany({
          where: {
            image_id: { in: images.delete.map(id => parseInt(id)) },
            product_id: updatedProduct.product_id,
          },
        });
      }

      // 2. Add new images
      if (images.add && images.add.length > 0) {
        await prisma.productImage.createMany({
          data: images.add.map((img) => ({
            product_id: updatedProduct.product_id,
            image_url: img.url,
            is_primary: false, // added images are not primary by default
          })),
        });
      }

      // 3. Set a new primary image
      if (images.setPrimary !== undefined) {
        const primaryId = parseInt(images.setPrimary);

        // Clear previous primary
        await prisma.productImage.updateMany({
          where: { product_id: updatedProduct.product_id },
          data: { is_primary: false },
        });

        // Set new primary
        await prisma.productImage.update({
          where: { image_id: primaryId },
          data: { is_primary: true },
        });
      }
    }

    // Fetch updated product data + images
    const productWithImages = await prisma.products.findUnique({
      where: { product_id: updatedProduct.product_id },
      include: { images: true },
    });

    return addFullImageUrls(productWithImages);
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("Product not found");
    }
    if (error.code === "P2002") {
      throw new Error("Product name already exists");
    }
    throw new Error(`Error updating product: ${error.message}`);
  }
};

//Delete product
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
