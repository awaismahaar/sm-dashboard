import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token", error });
  }
}

export async function checkRole(req, res, next) {
  const id = req.user.id;
  const user = await User.findById(id);
  if (!user.isAdmin) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized to access" });
  }
  next();
}
