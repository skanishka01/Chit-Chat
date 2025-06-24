const express = require('express');
const { aiChat } = require('../controllers/aiChatController');

const router = express.Router();

router.post('/', aiChat);

module.exports = router; 