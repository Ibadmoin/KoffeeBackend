const express = require('express');
const productRouter = express.Router();
const Product = require('../model/productModel');
const upload = require('../utils/multer');
const productController = require('../controller/productController')
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Post a new product with image upload
productRouter.post('/upload',authMiddleware,adminMiddleware ,upload.single('image'),productController.uploadProduct);

// Get all products
productRouter.get('/',productController.AllProducts);
// getting featured products
productRouter.get('/featured', productController.featuredProducts);
// getting category products
productRouter.get("/getcategories",productController.getCategory);
productRouter.get("/search",productController.Search);


module.exports = productRouter;
