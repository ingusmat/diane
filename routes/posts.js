const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const passport = require('passport');
require('../passport')(passport);
const User = require('../models/users');
const slug = require('slug');
const moment = require('moment');

const TokenHelper = require('../helpers/tokenHelper');

router.post('/new', passport.authenticate('jwt', { session: false}), async (req, res) => {
  const { body: reqBody = {}, headers = {}}  = req;
  const { title, tags, category, published, body, abstract, mainImageUrl, user } = reqBody;

  const token = TokenHelper.getToken(headers);
  if (!token) {
    res.status(403).json({success: false, msg: "Not Authorized"});
  } else {
    try {
      const { body: reqBody = {}}  = req;
      const { title, tags, category, body, abstract, mainImageUrl, user } = reqBody;
      const titleSlug = `${slug(moment().format('MM-Do-YY'))}-${slug(title)}`;

      const newPost = new Post({
        title, tags, category, body, abstract, published, mainImageUrl, user,
        createDate: moment().format(),
        slug: titleSlug
      });

      await newPost.save();
      res.status(201).json({
        success: true,
        post: newPost,
        msg: "New post created",
        slug: titleSlug
      })
    } catch(err) {
      console.log(err);
      res.status(500).json({msg: err, success: false});
    }
  }
});

router.get('/all/:page/:count', async(req, res) => {
  try {
    // const posts = await Post.find();
    const posts = await Post.find().populate('user');
    res.json({posts: posts})
  } catch(err) {
    console.log(err);
    res.status(500);
  }
});

router.get('/view/:titleSlug', async(req, res) => {
  try {
    const post = await Post.findOne({slug: req.params.titleSlug});
    res.json({post: post});
  } catch(err) {
    res.status(500);
  }
});

module.exports = router;