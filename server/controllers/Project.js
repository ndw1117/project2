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
  if (!req.body.title || !req.body.ownerName) {
    return res.status(400).json({ error: 'Both title and ownerName are required!' });
  }

  const projectData = {
    title: req.body.title,
    ownerName: req.body.ownerName,
    owner: req.session.account._id,
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
