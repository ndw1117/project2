const models = require('../models');

const { Project } = models;

const getProjects = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Project.find(query).select('title ownerName').lean().exec();

    return res.json({ projects: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving projects!' });
  }
};

const makerPage = async (req, res) => res.render('app');

const makeProject = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: 'Project title is required!' });
  }

  const projectData = {
    title: req.body.title,
    ownerName: req.session.account.username,
    owner: req.session.account._id,
  };
  
  if (req.session.account.email !== undefined) {
    projectData.ownerEmail = req.session.account.email;
  }

  if (req.body.link !== undefined) {
    projectData.link = req.body.link;
  }

  if (req.body.description !== undefined) {
    projectData.description = req.body.description;
  }

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
