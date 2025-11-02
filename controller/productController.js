const Product = require("../model/productModel");
const chalk = require("chalk");

const productController = {
      async uploadProduct(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Image file is required for upload." });
            }

            // 1. Destructure all fields, including the already-nested objects
            const { name, stars, description, category, featured, prices, volumes } = req.body;

            // --- DEBUG: The log below confirmed nesting is working. Keeping it for now. ---
            console.log(chalk.cyan("Raw req.body from Multer:"), req.body);
            // --- END DEBUG ---

            // 2. CRITICAL FIX: Since 'prices' is now an object, we must convert its string properties to Numbers
            // We can map the price keys directly for safety and conversion
            const finalPrices = {
                small: Number(prices.small),
                medium: Number(prices.medium),
                large: Number(prices.large),
            };

            // 3. Validation Check (Simplified)
            // Mongoose will check required fields, but this is a good sanity check
            if (!finalPrices.small || !finalPrices.medium || !finalPrices.large) {
                 return res.status(400).json({ 
                     error: "Missing required price values (small, medium, large)." 
                 });
            }

            const imageUrl = req.file.path; 

            const newProduct = new Product({
                name,
                prices: finalPrices, // Use the converted numeric object
                volumes: volumes,    // Use the nested volume object directly (they are strings)
                stars: Number(stars) || 0, // Ensure stars is converted to a number
                description,
                category:category.toLowerCase(),
                // Convert the string 'true'/'false' from form-data into a boolean
                featured: featured === 'true', 
                imageUrl,
            });

            const savedProduct = await newProduct.save();
            console.log(chalk.green(`Product saved successfully: ${savedProduct.name}`));
            res.status(200).json({ message: 'Product uploaded successfully.', savedProduct });

        } catch (err) {
            // This block handles Mongoose validation errors
            console.error(chalk.red('Product Upload Error:'), err.message);
            
            // For Mongoose validation errors (status 400)
            if (err.name === 'ValidationError') {
                return res.status(400).json({ error: err.message });
            }

            // For all other errors (status 500)
            res.status(500).json({ message: 'Internal server error during product processing.' });
        }
    },
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
