const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
require("dotenv").config();

const axiosConfig = {
  headers: {
    Authorization: process.env.BEARERTOKEN,
    Accept: "application/json",
  },
};

const WooCommerce = new WooCommerceRestApi({
  url: process.env.BASEURL,
  consumerKey: process.env.CONSUMERKEY,
  consumerSecret: process.env.CONSUMERSECRET,
  version: "wc/v3",
});

const categoryIdsData = [
  // Computer components
  { id: 500, wpId: 311 },
  { id: 379, wpId: 311 },
  { id: 389, wpId: 311 },
  { id: 615, wpId: 311 },
  { id: 388, wpId: 311 },
  { id: 376, wpId: 311 },
  { id: 382, wpId: 311 },
  { id: 384, wpId: 311 },
  { id: 512, wpId: 311 },
  { id: 496, wpId: 311 },
  { id: 377, wpId: 311 },

  // Monitors and displays
  { id: 394, wpId: 312 },

  // Software
  { id: 499, wpId: 313 },

  // Computer peripherals
  { id: 490, wpId: 314 },
  { id: 641, wpId: 314 },
  { id: 399, wpId: 314 },
  { id: 402, wpId: 314 },
  { id: 504, wpId: 314 },
  { id: 407, wpId: 314 },
  { id: 408, wpId: 314 },

  // Gaming peripheral devices
  { id: 668, wpId: 316 },
  { id: 493, wpId: 316 },
  { id: 587, wpId: 316 },
  { id: 502, wpId: 316 },
  { id: 404, wpId: 316 },
  { id: 524, wpId: 316 },
  { id: 511, wpId: 316 },
  { id: 546, wpId: 316 },
  { id: 540, wpId: 316 },

  // Laptops
  { id: 543, wpId: 298 },

  // Tablets
  { id: 483, wpId: 274 },

  // Network equipment
  { id: 412, wpId: 315 },
];

module.exports = { categoryIdsData, WooCommerce, axiosConfig };
