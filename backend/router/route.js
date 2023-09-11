const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../model/userschema');
const multer = require('multer');
const Resume = require('../model/resumeschema')
const cors = require('cors');
dotenv.config({ path: './config.env' });
const fs = require("fs");
const { ObjectId } = require("mongodb");
const path = require('path');
dotenv.config({path:'./config.env'});


router.use(cors({ origin: 'http://localhost:3000' }));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now()+'_'+file.originalname)
  }
});
var upload = multer({ storage: storage });


router.post('/register1', upload.none(), async (req, res) => {
  try {
    const { name, email, contact, DOB, gender, current_location, password, confirm_password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    if (password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
    const user = new User({ name, email, contact, DOB, gender, current_location, password,confirm_password});
    await user.save();
    console.log(user._id)
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});



router.patch('/updateprofile/:id', upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.files['cv']) {
      user.cv = req.files['cv'][0].filename;
    }
    if (req.files['image']) {
      user.image = req.files['image'][0].filename;
    }
    if (req.body.skill) {
      user.skill = req.body.skill;
    }
    if (req.body.experience) {
      user.experience = req.body.experience;
    }
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    var userId = user._id
    res.status(200).json({ id: userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/user', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/user/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.send(user);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get('/image/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.sendFile(path.join(__dirname, '..', 'uploads',user.image));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/cv/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.sendFile(path.join(__dirname, '..', 'uploads',user.cv));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { skill } = req.query;
    const users = await User.find({
      skill: { $regex: skill, $options: "i" },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;