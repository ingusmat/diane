const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  tags: {
    type: Array
  },
  category: {
    type: String
  },
  body: {
    type: String,
    required: true
  },
  abstract: {
    type: String,
    required: true
  },
  mainImageUrl: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createDate: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  published: {
    type: Boolean,
    required: true
  }
});



module.exports = mongoose.model('Post', PostSchema)

