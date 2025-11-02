const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET 
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products', // optional, if you want to organize uploads in Cloudinary
        format: async (req, file) => 'png', // file format (you can change it as needed)
        public_id: (req, file) => `${file.originalname}-${Date.now()}`, // unique identifier for each file
    },
});

const upload = multer({ storage: storage });

module.exports = upload
