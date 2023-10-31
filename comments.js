// Create web server
// Import express
const express = require('express');
const router = express.Router();

// Import comment model
const Comment = require('../models/comment');

// Import post model
const Post = require('../models/post');

// Import User model
const User = require('../models/user');

// Import middleware
const middleware = require('../middleware');

// Import sanitize-html
const sanitizeHtml = require('sanitize-html');

// Import moment
const moment = require('moment');

// Import nodemailer
const nodemailer = require('nodemailer');

// Import smtpTransport
const smtpTransport = require('nodemailer-smtp-transport');

// Import dotenv
const dotenv = require('dotenv');

// Import cloudinary
const cloudinary = require('cloudinary');

// Import multer
const multer = require('multer');

// Import cloudinaryStorage
const cloudinaryStorage = require('multer-storage-cloudinary');

// Import cloudinary config
const cloudinaryConfig = require('../config/cloudinary');

// Import cloudinary config
const cloudinaryConfig = require('../config/cloudinary');

// Configure cloudinary
cloudinary.config({
	cloud_name: cloudinaryConfig.cloud_name,
	api_key: cloudinaryConfig.api_key,
	api_secret: cloudinaryConfig.api_secret
});

// Configure cloudinary storage
const storage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: 'post_images',
	allowedFormats: ['jpg', 'jpeg', 'png']
});

// Configure multer
const parser = multer({ storage: storage });

// Import dotenv
dotenv.config();

// Create comment
router.post('/posts/:id/comments', middleware.isLoggedIn, parser.single('image'), async (req, res) => {
	try {
		// Find post
		const post = await Post.findById(req.params.id);

		// Check if post exists
		if (!post) {
			req.flash('error', 'Post not found');
			return res.redirect('/posts');
		}

		// Check if comment is empty
		if (req.body.comment === '') {
			req.flash('error', 'Comment cannot be empty');
			return res.redirect(`/posts/${post._id}`);
		}

		// Create comment
		const comment = new Comment({
			text: sanitizeHtml(req.body.comment),