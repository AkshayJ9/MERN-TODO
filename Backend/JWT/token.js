import jwt from "jsonwebtoken";
import User from "../model/user.model.js"; // Importing the User model it is assumed as a database model

export const generateTokeAndSaveInCookies = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10d",
    // expries: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });
  await User.findByIdAndUpdate(userId, { token });
  return token;
};
