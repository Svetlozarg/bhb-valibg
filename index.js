const express = require("express");
const cron = require("node-cron");
const axios = require("axios");
const dotenv = require("dotenv");
const { categoryIdsData, WooCommerce, axiosConfig } = require("./helper"); // Import helper functions
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const baseValiBgUrl = process.env.BASEVALIBGURL;

async function fetchProductsByCategory(categoryId) {
  try {
    const response = await axios.get(
      `${baseValiBgUrl}/products/by_category/${categoryId}/full`,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    console.error(
      `API error while fetching products for category ${categoryId}:`,
      error
    );
    return [];
  }
}

const checkProductExistence = async (productName) => {
  return WooCommerce.get("products", {
    search: productName, // Use the product name as the search parameter
  })
    .then((response) => {
      const products = response.data;
      if (products.length > 0) {
        // Product with the given name exists
        return true;
      } else {
        // Product does not exist
        return false;
      }
    })
    .catch((error) => {
      console.error("Error checking product existence:", error);
      return false;
    });
};

async function importProducts(products, categoryId) {
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const imagesData = product.images.map((image) => ({
      src: image.href,
    }));

    const productName = product.name[1].text; // Get the product name

    // Check if the product already exists
    const productExists = await checkProductExistence(productName);

    if (productExists) {
      console.log(`Product "${productName}" already exists. Skipping.`);
      continue; // Skip adding the product if it already exists
    }

    const data = {
      name: productName, // name
      type: "simple", // type
      regular_price: (product.price_client * 1.2).toString(), // regular price
      description: product.description[1].text, // description
      short_description: product.description[1].text, // short description
      categories: [
        {
          id: categoryId,
        },
      ], // categories
      images: imagesData, // images
      meta_data: [{ key: "_alg_ean", value: product.barcode }], // barcode
    };

    try {
      const response = await WooCommerce.post("products", data);
      console.log(`${productName} successfully added`);
    } catch (error) {
      console.error(`Error adding ${productName}:`, error.response.data);
    }
  }
}

async function createProductsForCategory(category) {
  console.log(`Importing products for category ${category.id}`);
  const products = await fetchProductsByCategory(category.id);
  await importProducts(products, category.wpId);
}

async function executeTask() {
  try {
    await WooCommerce.get("");
    console.log("WooCommerce connection successfully established");

    for (const category of categoryIdsData) {
      await createProductsForCategory(category);
    }
  } catch (error) {
    console.error("WooCommerce connection failed:", error);
    console.log("Stopping server...");
    process.exit(0);
  }
}

executeTask();

// Task runs at midnight on Tuesdays and Fridays (0 0 * * 2,5)
cron.schedule("0 0 * * 2,5", () => {
  console.log("Executing the script...");
  executeTask();
});

// Start the server
app.listen(port, () => {
  console.log(
    `Server successfully started and is running on http://localhost:${port}`
  );
});
