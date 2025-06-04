const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { fullName, idNumber, accountNumber, username, password } = req.body;

  try {
    // Check for existing user by account number, username, or ID number
    let existingUser = await User.findOne({ 
      $or: [{ accountNumber }, { username }, { idNumber }] 
    });
    
    if (existingUser) {
      let conflictType = 'Account';
      if (existingUser.username === username) conflictType = 'Username';
      else if (existingUser.idNumber === idNumber) conflictType = 'ID Number';
      
      return res.status(400).json({ 
        success: false,
        msg: `${conflictType} already exists` 
      });
    }

    // Create new user
    const user = new User({ 
      fullName, 
      idNumber,
      accountNumber, 
      username,
      password // Will be hashed automatically by the pre-save middleware
    });
    
    await user.save();

    res.status(201).json({ 
      success: true,
      msg: "User registered successfully" 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false,
      msg: "Server error during registration" 
    });
  }
};

exports.login = async (req, res) => {
  const { accountNumber, password } = req.body;

  try {
    const user = await User.findOne({ accountNumber });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
