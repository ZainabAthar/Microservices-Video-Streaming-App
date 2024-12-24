const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  imageLink: {
    type: String, 
    required: true,
  },
  publicId: {
    type: String, 
    required: true,
  },
});

const gallerySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  freeStorage: {
    type: Number,
    required: true,
  },
  freeBandwidth: {
    type: Number,
    required: true,
  },
  images: [imageSchema],
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = { Gallery };
