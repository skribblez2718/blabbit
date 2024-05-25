const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { isLoggedIn, isAuthor, validateBlabbit } = require('../middleware');
const blabbits = require('../controllers/blabbits');

const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(catchAsync(blabbits.index))
    .post(isLoggedIn, upload.array('images'), validateBlabbit, catchAsync(blabbits.createBlabbit));

router.get('/new', isLoggedIn, blabbits.renderNewForm);

router.route('/:id')
    .get(catchAsync(blabbits.showBlabbit))
    .put(isLoggedIn, isAuthor, upload.array('images'), validateBlabbit, catchAsync(blabbits.editBlabbit))
    .delete(isLoggedIn, isAuthor, catchAsync(blabbits.deleteBlabbit));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(blabbits.renderEditBlabbit));

module.exports = router