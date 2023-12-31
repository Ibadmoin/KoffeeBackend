const Product = require("../model/productModel");
const chalk = require("chalk");

const productController = {
  async featuredProducts(req, res) {
    try {
      const featuredProducts = await Product.find({ featured: true });
      res.json({ success: true, featuredProducts });
    } catch (err) {
      console.log(chalk.red("Error in getting Featured products", err));
      res.status(500).json({ success: false, error: "internal Server Error" });
    }
  },

  async AllProducts(req, res) {
    try {
      const products = await Product.find({ featured: { $ne: true } });
      res.status(200).json({ success: true, products });
    } catch (err) {
      console.log("error=>", err);
      res.status(500).json({ error: err.message });
    }
  },
  async getCategory(req, res) {
    try {
      const { category } = req.query;
      if (!category) {
        return res
          .status(400)
          .json({ success: false, error: "Category parameter is required" });
      }
      const products = await Product.find({ category: category });
      if (products.length === 0) {
        return res
          .status(404)
          .json({
            success: false,
            error: "No products found for the specified category",
          });
      }
      return res.status(200).json({ success: true, products });
    } catch (err) {
      console.log("Error=>", err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  },

  async Search(req, res) {
    try {
      const {term } = req.query;
      const regex = term ? new RegExp(term.trim(), "i") : undefined;
  
      
  
      const suggestions = await Product.find({
        name: regex,
      
      }).limit(5);
      if(suggestions.length===0){
        return res.status(404).json({success:false, message:"No product suggestion found!"})
      }
  
      return res.status(200).json({ suggestions });
    } catch (err) {
      console.log("Error getting results:", err);
      res.status(500).json({ message: "Internal Server Error", error: err });
    }
  }
  
};

module.exports = productController;
