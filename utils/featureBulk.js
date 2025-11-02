require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('../model/productModel');
const fs = require('fs').promises;
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const chalk = require('chalk');

// Images paths should be in assets/images
// make sure to upload png images
// cd utils then node bulkScript.js


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET, 
});

// Define the CloudinaryStorage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products', // optional, if you want to organize uploads in Cloudinary
        format: async (req, file) =>file.mimetype.split('/')[1] , // file format (you can change it as needed)
        public_id: (req, file) => `${file.originalname}-${Date.now()}`, // unique identifier for each file
    },
});

// Configure multer without using upload.single('image')
const upload = multer({
    storage: storage,
}).single('image');

async function bulkUpload() {
    try {
        const uri = process.env.MONGO_URI;
        console.log(chalk.red(uri))
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        const data = await fs.readFile('./product.json', 'utf8');
        const jsonData = JSON.parse(data);
        const products = jsonData.products;

        // Loop through products and save them to the database
        for (const productData of products) {
            const { name, prices, volumes, stars, description, image, category,featured } = productData;

            try {
                const cloudinaryResponse = await cloudinary.uploader.upload(image, {
                    folder: 'products',
                    public_id: `${name}-${Date.now()}`,
                });

                const newProduct = new Product({
                    name,
                    prices,
                    volumes,
                    stars,
                    description,
                    category,
                    featured: true,
                    imageUrl: cloudinaryResponse.secure_url,
                });

                await newProduct.save();
                console.log(`Product "${name}" uploaded successfully.`);
            } catch (err) {
                console.error('Error processing product:', err);
            }
        }

        console.log('Bulk upload completed.');
    } catch (err) {
        console.error('Error uploading products:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        console.log(process.env.MONGO_URI);
    }
}

bulkUpload();
