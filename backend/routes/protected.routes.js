const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Protected profile route is active',
    user: req.user || null,
  });
});

module.exports = router;
