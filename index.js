const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.get("/api", (req, res) => {
  res.send("Hello world!");
});

app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  const productId = req.params.id;

  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(productId),
    },
  });
  if (!product) {
    return res.status(404).send("product not found");
  }
});

app.post("/products", async (req, res) => {
  const newProductData = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name: newProductData.name,
        price: newProductData.price.toString(), // Mengonversi nilai harga ke String
        description: newProductData.description,
        image: newProductData.image,
      },
    });

    res.send({
      data: product,
      message: "Create product successfully",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.delete("/products/:id", async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const deletedProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    res.send({
      data: deletedProduct,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// put
app.put("/products/:id", async (req, res) => {
  const productId = parseInt(req.params.id); // Parse id ke integer

  const { name, price, description, image } = req.body; // Destructure req.body untuk mendapatkan data

  try {
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: name,
        price: price.toString(), // Mengonversi nilai harga ke String
        description: description,
        image: image,
      },
    });

    res.send({
      data: updatedProduct,
      message: "Produk berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Tambahkan rute PATCH untuk memperbarui data produk secara sebagian
app.patch("/products/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  const { name, price, description, image } = req.body; // Destructure req.body untuk mendapatkan data

  try {
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: name,
        price: price,
        description: description,
        image: image,
      },
    });

    res.send({
      data: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log("Express API running on port: " + PORT);
});
