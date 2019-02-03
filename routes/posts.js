const express = require('express');
const router = express.Router();

router.get('/all/:page/:count', (req, res) => {
    res.json({posts: 'none yet'})
  }
);

module.exports = router;