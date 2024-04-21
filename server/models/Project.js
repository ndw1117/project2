const mongoose = require('mongoose');
const _ = require('underscore');

const setTitle = (title) => _.escape(title).trim();

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },
  image: {
    type: Buffer,
    required: false,
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
    required: false,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const ProjectModel = mongoose.model('Project', ProjectSchema);
module.exports = ProjectModel;
