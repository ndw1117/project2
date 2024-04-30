// This file defines our schema and model interface for the project data.

const mongoose = require('mongoose');
const _ = require('underscore');

// Trims the title
const setTitle = (title) => _.escape(title).trim();

/* Our schema defines the data we will store. */
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },
  image: {
    type: Buffer,
    required: true,
  },
  imageType: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  ownerEmail: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts a doc to something we can store elsewhere later on.
ProjectSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  ownerName: doc.ownerName,
});

const ProjectModel = mongoose.model('Project', ProjectSchema);
module.exports = ProjectModel;
