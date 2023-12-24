const { bool, boolean } = require('joi');
const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
  name: {type: String, required: true},
  prices:{
    small:{type: Number, required:true},
    medium:{type:Number, required:true},
    large:{type:Number, required:true},
  },
  volumes:{
    small: String,
    medium: String,
    large: String,
  },
  stars: {type:Number, default: 0},
  imageUrl: String,
  description: String,
  category: {type:String, required:true},
  featured: {type: Boolean}
});



const Product = mongoose.model('Product', productSchema);

module.exports = Product