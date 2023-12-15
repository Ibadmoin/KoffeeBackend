const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  volume: String,
  stars: { type: Number, default: 0 },
  imageUrl: String,
  description: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
