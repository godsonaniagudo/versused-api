const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: "codefroyo",
    api_key: 727716882826246,
    api_secret: "M6mkQGwr3zAQBpTFUgeJ2iQL2mk",
  });

  module.exports = cloudinary
