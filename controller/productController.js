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
    },

    async AllProducts(req,res){
        try{
            const products = await Product.find({featured:{$ne:true}});
            res.status(200).json({success:true, products});

        }catch(err){
            console.log("error=>",err);
            res.status(500).json({error:err.message})
        
        }
    }
}





module.exports = productController;