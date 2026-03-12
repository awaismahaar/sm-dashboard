import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

async function createUser(req, res) {
  try {
    const userReq = req.body;
    if (!userReq.email || !userReq.name || !userReq.password) {
      return res
        .status(404)
        .json({ success: false, message: "Please fill all fields!" });
    }
    const isUserExist = await User.findOne({ email: userReq.email });
    if (isUserExist) {
      return res
        .status(404)
        .json({ success: false, message: "User already exists!" });
    }

    const user = await User.create({
      name: userReq.name,
      email: userReq.email,
      password: userReq.password,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      user: {
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
}
async function login(req, res) {
  try {
    const userReq = req.body;
    if (!userReq.email || !userReq.password) {
      return res
        .status(404)
        .json({ success: false, message: "Please fill all fields!" });
    }

    const user = await User.findOne({ email: userReq.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials!" });
    }

    const valid = await user.comparePassword(userReq.password);
    if (!valid) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials!" });
    }
    console.log(user);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // true in production (HTTPS)
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const newUser = await User.findById(user._id).select("-password");
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
    console.log(error);
  }
}

async function logout(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(404).json({
      success: false,
      message: "Token not found!",
    });
  }
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logout successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
}

async function getProfile(req, res) {
  try {
    const id = req.user.id;
    const user = await User.findById(id).select("-password");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
}

async function allUsers(req, res) {
  const id = req.user.id;
  try {
    const users = await User.find({
      _id: { $ne: id },
    })
      .select("-password")
      .lean();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
}

async function updateUser(req, res) {
  try {
    const id = req.user.id;
    
    const { name, password } = req.body;
    let hashPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    }
    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        password: hashPassword,
      },
      { new: true, runValidators: true },
    ).select("-password");
    res.status(200).json({
      success: true,
      message: "User update successfully!",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
}
async function deleteUser(req, res) {
  try {
    const id = req.params.id;
    const isUserExists = await User.findById(id);
    if (!isUserExists) {
      return res.status(404).json({
        success: true,
        message: "User does not exists!",
      });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
}
export {
  createUser,
  login,
  logout,
  getProfile,
  allUsers,
  updateUser,
  deleteUser,
};
