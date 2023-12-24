const Product = require('../model/productModel')
const chalk = require('chalk');




const productController = {
    async featuredProducts(req,res){
        try{

            const featuredProducts = await Product.find({featured:true})
            res.json({success:true, featuredProducts});


        }catch(err){
            console.log(chalk.red("Error in getting Featured products",err));
            res.status(500).json({success:false, error: "internal Server Error"})
        }
    }
}





module.exports = productController;