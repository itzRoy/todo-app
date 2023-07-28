const User = require('./model');
const utils = require('../utils');

module.exports.singup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const isUserExists = await User.findOne({email});

    if (isUserExists) {

      return res.status(409).json({ success: false, message: 'User already exists' });

    }

    const user = await User.create({email, password, todoList: []});
    const access_token = utils.createToken(user._id);

    return res.status(201).json({success: true, data: user, access_token});

  } catch (error) {

    return res.status(500).json({success: false, message: 'something went wrong', error});

  }
};

module.exports.login = async (req, res) => {

  const { email, password } = req.body;
  const user = await User.findOne({email});

  if (!user || password !== user.password) {

    return res.status(401).json({message: 'wrong credentials'});

  }

  const access_token = utils.createToken(user._id); 

  return res.cookie('access_token', access_token).status(200).json({ status: 200, success: true, message: 'logged in', result: {access_token}});


};

module.exports.logout = async (req, res) => {
  res
    .clearCookie('access_token')
    .status(200)
    .header('Cache-Control', 'no-cache')
    .json({ success: true, message: 'Successfully logged out' });
};