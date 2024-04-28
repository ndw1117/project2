const models = require('../models');

const { Project } = models;

const getProjects = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Project.find(query).select('title image imageType ownerName ownerEmail description link').lean().exec();

    return res.json({ projects: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving projects!' });
  }
};

const makerPage = async (req, res) => res.render('app');

const makeProject = async (req, res) => {
  let imageBuffer;

  if (req.file) {
    imageBuffer = req.file.buffer;
  }

  if (!req.body.title) {
    return res.status(400).json({ error: 'Project title is required!' });
  }

  // Uses spread syntax to fill out the optional parts of the data, if provided
  const projectData = {
    title: req.body.title,
    ownerName: req.session.account.username,
    owner: req.session.account._id,
    ...(req.session.account.email && { ownerEmail: req.session.account.email }),
    ...(req.body.link && { link: req.body.link }),
    description: req.body.description,
    image: imageBuffer,
    imageType: req.body.imageType,
  };

  try {
    const newProject = new Project(projectData);
    await newProject.save();
    return res.status(201).json({ title: newProject.title, ownerName: newProject.ownerName });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Project already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making the project!' });
  }
};

module.exports = {
  makerPage,
  makeProject,
  getProjects,
};
