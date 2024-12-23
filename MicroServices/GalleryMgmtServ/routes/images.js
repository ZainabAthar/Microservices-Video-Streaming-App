const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { storage, cloudinary } = require("../cloudinary/index.js");
const multer = require("multer");
const upload = multer({ storage: storage });
const { Gallery } = require("../models/GallerySchema");
const formidable = require('formidable');
const path =require("path");
function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "Authorization token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const fileExtension = path.extname(file.originalFilename).toLowerCase();
    const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm', '.ogg'];
    const resourceType = videoExtensions.includes(fileExtension) ? 'video' : 'image';

    cloudinary.uploader.upload(
      file.filepath,
      { resource_type: resourceType, folder: 'photogallery' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

router.get("/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const userGallery = await Gallery.findOne({ userId });

    if (!userGallery) {
      return res.status(404).json({ error: 'User gallery not found' });
    }

    res.status(200).json({ gallery: userGallery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user gallery' });
  }
});

router.post("/add/:userId", async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async(err, fields, files) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error occurred during file upload");
      return;
    }

    const userId = req.params.userId;
    const images = Object.values(files.images); 
    try {
      const imageLinks = [];
      const totalSizeKB = images.reduce((acc, image) => acc + image.size, 0) / 1024; 
      const userGallery = await Gallery.findOne({ userId });

      if (!userGallery) {
        return res.status(404).json({ error: 'User gallery not found' });
      }

      if (totalSizeKB > userGallery.freeStorage) {
        return res.status(400).json({ error: 'Image size exceeds available storage' });
      }
      if(totalSizeKB > userGallery.freeBandwidth){
        return res.status(400).json({ error: 'Image size exceeds available bandwidth for today' });
        
      }
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.tiff', '.webp', '.svg', '.ico', '.jfif', '.pjpeg', '.pjp','.mp4'];
      for (const image of images) {
        const fileExtension = path.extname(image.originalFilename).toLowerCase();
      console.log(fileExtension)
      if (!validExtensions.includes(fileExtension)) {
        console.log("hereeee in invlid extension")
        return res.status(400).json({ error: 'Invalid file extension.' });
      }
      }
      const imagesEv=[];
      for (const image of images) {
        const uploadedImage = await uploadToCloudinary(image);
        const newImage = {
          title: image.originalFilename,
          size: image.size/1024,
          imageLink: uploadedImage.secure_url,
          publicId:uploadedImage.public_id,
          type: uploadedImage.resource_type,
        };
        imageLinks.push(uploadedImage.secure_url);
        userGallery.images.push(newImage);
        userGallery.freeStorage-=newImage.size;
        userGallery.freeBandwidth-=newImage.size;
        imagesEv.push(newImage)
      }





     
      


      
      await userGallery.save();
      const gallery=userGallery;
      try{
        await axios.post(`${process.env.EVENT_SERV}/events`, {
           type: "ImagesAdded",
           data: {
            userId,
            imagesEv,
            gallery: gallery
           },
          });
        }
        catch(error){
          console.log(error)
      }
      res.status(200).json({ links: imageLinks, gallery: gallery });
    }catch(error){
      
      console.error(error);
      res.status(500).json({ error: 'Failed to upload images' });
    }
  });
  });

  router.delete("/:userId/:imageId", verifyToken, async (req, res) => {
    const userId = req.params.userId;
    const imageId = req.params.imageId;
    try {
      const userGallery = await Gallery.findOne({ userId });
  
      if (!userGallery) {
        return res.status(404).json({ error: "User gallery not found" });
      }
  
      const imageToDelete = userGallery.images.id(imageId);
      if (!imageToDelete) {
        return res.status(404).json({ error: "Image not found" });
      }
  
      const imageSize = imageToDelete.size;
      await cloudinary.uploader.destroy(imageToDelete.publicId);
  
      const imageDocument = imageToDelete.toObject(); 
      userGallery.images.pull({ _id: imageDocument._id });
      await userGallery.save();
      console.log(imageSize)
      try{
        await axios.post(`${process.env.EVENT_SERV}/events`, {
           type: "ImageRemoved",
           data: {
            userId,
            imageId,
            imageSize,
            gallery: userGallery
           },
          });
        }
        catch(error){
          console.log(error)
        }
        res.status(200).json({ message: "Image deleted successfully", gallery: userGallery });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  });

module.exports = router;
