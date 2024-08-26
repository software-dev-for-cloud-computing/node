const User = require('../models/user');  // Model for the user
const bcrypt = require('bcryptjs');      // For hashing and comparing passwords
const jwt = require('jsonwebtoken');     // For creating JWT tokens for authentication

// Registration function
exports.register = async (req, res) => {
  // Extract user data from the request body
  const { username, email, password } = req.body;

  try {
    // Create a new user object based on the incoming data
    const newUser = new User({ username, email, password });

    // Save the new user to the database
    await newUser.save();

    // Send a successful response with status 201 and the new user
    res.status(201).json(newUser);
  } catch (err) {
    // In case of an error, send an error message with status 500
    res.status(500).json({ message: err.message });
  }
};

// Login function
exports.login = async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  try {
    // Look for a user with the specified email address
    const user = await User.findOne({ email });

    // If the user is not found, send an error message
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Compare the entered password with the one stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // If the passwords do not match, send an error message
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create the payload for the JWT token
    const payload = { id: user.id, username: user.username };

    // Sign the JWT token with a secret key and an expiration time of 1 hour
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

    // Send the token as a JSON response
    res.json({ token });
  } catch (err) {
    // In case of an error, send an error message with status 500
    res.status(500).json({ message: err.message });
  }
};
