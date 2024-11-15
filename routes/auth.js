// // routes/auth.js
// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../Models/Users');
// const router = express.Router();
// // const bcrypt = require('bcryptjs');

// // Register Route
// router.post('/register', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     // Save the user
//     await newUser.save();
//     res.status(201).json({ message: 'User created successfully' });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Login Route
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
// console.log(email, 'username')
//   try {
//     // Find the user by email
    
//     const user = await User.findOne({ email });
//     console.log( user, 'user')
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
      
//     }
// //     const salt = bcrypt.genSalt()
// // const hashedPassword= bcrypt.hash((user.password).encode('utf-8'),salt)
// //     // Compare the password with the stored hash
// //     console.log(hashedPassword, 'hashedpassword')
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log(isMatch,"ismatch")
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Create a JWT token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' } // Token expires in 1 hour
//     );

//     res.status(200).json({
//       message: 'Login successful',
//       token,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;



const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/Users');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, 'username');
  
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log(user, 'user');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch, 'ismatch');
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({
      message: 'Login successful',
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Token Route
router.post('/verify-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extract token from "Bearer <token>" header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify JWT token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    try {
      // Token is valid, fetch user data (optional)
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Respond with user info (or just isValid if you prefer)
      res.json({ isValid: true, user: { username: user.username, email: user.email } });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

module.exports = router;
