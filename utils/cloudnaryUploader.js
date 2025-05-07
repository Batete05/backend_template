const { v2: cloudinary } = require('cloudinary');


// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(image,name) {
    try {
        const uploadResult = await cloudinary.uploader.upload(image, { public_id: name });
        return uploadResult;
    } catch (error) {
        // console.error('Cloudinary Upload Error:', error.message);
        throw new Error('Image upload failed');
    }
}

module.exports = {uploadToCloudinary}