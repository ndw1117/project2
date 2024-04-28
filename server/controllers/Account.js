const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');
const accountPage = (req, res) => res.render('account');

const getAccount = async (req, res) => {
  try {
    const docs = await Account.findById(req.session.account._id).select('username email').lean().exec();

    return res.json({ user: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving account info!' });
  }
};

const logout = (req, res) => {
  // Destory removes a user's session so we know they are no longer logged in
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const email = `${req.body.email}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'Missing required fields!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const hash = await Account.generateHash(pass);
    let newAccount;
    if (email !== undefined) {
      newAccount = new Account({ username, password: hash, email });
    } else {
      newAccount = new Account({ username, password: hash });
    }
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const changePassword = async (req, res) => {
  const { username } = req.session.account;
  const newPass = `${req.body.pass}`;
  const newPass2 = `${req.body.pass2}`;

  if (!newPass || !newPass2) {
    return res.status(400).json({ error: 'Missing required fields!' });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const hash = await Account.generateHash(newPass);
    await Account.updateOne(
      { username }, // Filter
      { $set: { password: hash } }, // Update
    );
    return res.status(200).json({ message: 'Password Updated Succesfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

module.exports = {
  getAccount,
  loginPage,
  accountPage,
  login,
  logout,
  signup,
  changePassword,
};
