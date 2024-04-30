// This file is responsible for routing requests to the server to the proper controller functions

// Multer is used for sending complex multipart form data with images and text
const multer = require('multer');
const controllers = require('./controllers');
const mid = require('./middleware');

const upload = multer();

const router = (app) => {
  app.get('/getProjects', mid.requiresLogin, controllers.Project.getProjects);
  app.get('/getRandomProjects', mid.requiresLogin, controllers.Project.getRandomProjects);
  app.get('/getAccount', mid.requiresLogin, controllers.Account.getAccount);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/account', mid.requiresLogin, controllers.Account.accountPage);

  app.post('/newPass', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);
  app.post('/setPremium', mid.requiresLogin, mid.requiresSecure, controllers.Account.setPremium);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Project.makerPage);
  // single() processes the image file from the multipart form data
  app.post('/maker', mid.requiresLogin, upload.single('image'), controllers.Project.makeProject);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
