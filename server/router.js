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

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // Change to Project.makerPage and confirm it works
  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  // app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);
  app.post('/maker', mid.requiresLogin, upload.single('image'), controllers.Project.makeProject);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
