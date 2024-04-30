const { ObjectId } = require('mongodb');
const models = require('../models');

const { Project } = models;

// Returns all projects belonging to the current user
const getProjects = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Project.find(query).select('title image imageType ownerName ownerEmail description link premium').lean().exec();

    return res.json({ projects: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving projects!' });
  }
};

// Returns a random selection of other users' projects
const getRandomProjects = async (req, res) => {
  try {
    // Convert the string ID to an ObjectID. Needed for propery query comparison
    const accountId = ObjectId.createFromHexString(req.session.account._id);

    // $ne is the MongoDB operator for "not equal"
    const query = { owner: { $ne: accountId } };

    // Parses the query parameter for the number of projects requested
    const num = parseInt(req.query.num, 10);

    // If there is a number of projects requested, conduct the search using that number
    if (num) {
      const docs = await Project.aggregate([
        { $match: query },
        { $sample: { size: num } },
        {
          $project: {
            title: 1,
            image: 1,
            imageType: 1,
            ownerName: 1,
            ownerEmail: 1,
            description: 1,
            link: 1,
            premium: 1,
          },
        },
      ]);

      return res.json({ projects: docs });
    }

    // Else a num wasn't given
    const docs = await Project.aggregate([
      { $match: query },
      {
        $project: {
          title: 1,
          image: 1,
          imageType: 1,
          ownerName: 1,
          ownerEmail: 1,
          description: 1,
          link: 1,
          premium: 1,
        },
      },
      { $addFields: { randomOrder: { $rand: {} } } }, // Add a random field to each document
      { $sort: { randomOrder: 1 } }, // Sort the documents by the random field
      { $project: { randomOrder: 0 } }, // Exclude the randomOrder field from the final output
    ]);

    return res.json({ projects: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving projects!' });
  }
};

// Handles a request to render the maker page
const makerPage = async (req, res) => res.render('app');

// Creates a new project using the given information
const makeProject = async (req, res) => {
  let imageBuffer;

  if (req.file) {
    imageBuffer = req.file.buffer;
  }

  if (!req.body.title || !req.body.description) {
    return res.status(400).json({ error: 'Project title and description is required!' });
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
    premium: req.session.account.premium,
  };

  try {
    // Creates and saves the new project
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
  getRandomProjects,
};
