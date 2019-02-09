const express = require('express');
const secret = process.env.PASSPORT_SECRET;
const router = express.Router();
const passport = require('passport');
require('../passport')(passport);
const User = require('../models/users');
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json({users: users});
  } catch(err) {
    console.log(err);
    res.status(500);
  }
});

router.post('/signup', async (req, res) => {
  const { body = {} } = req;
  const { username, password, email } = body;
  if (!username || !password || !email) {
    res.json({success: false, msg: "Please pass valid email, username and password to create a user"});
  }
  const newUser = new User({...body});
  try {
    await newUser.save();
    res.json({success: true, msg: 'Successfully created new user.'})
    res.json({username: username, password:password, email:email});
  } catch(err) {
    console.log(['there was an error', err]);
    res.status(500).json(err);
  }
});

router.post('/signin', async (req, res) => {
  const { body = {} } = req;
  const { email = '' } = body;
  try {
    const user = await User.findOne({email});
    if (!user) {
      res.status(401).json({success: false, msg: "Authentication failed."});
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch && !err) {
        const token = jwt.sign(user.toObject(), secret);
        delete user.password;
        res.status(200).json({token, user});
      } else {
        res.status(401).json({success: false, msg: "Authentication failed."});
      }
    });
  } catch(err) {
    console.log(['there was an error', err]);
    res.status(500).json(err);
  }
});

/**
 * Get user from token
 */
router.post('/auth', passport.authenticate('jwt', { session: false}), function(req, res) {
  const token = TokenHelper.getToken(req.headers);
  if (token) {
    return res.json({success: true, user: {userName: req.user.username, email: req.user.email, role: req.user.role}});
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

module.exports = router;
