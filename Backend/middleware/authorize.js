// import jwt from "jsonwebtoken";

// export const authenticate = (req, res, next) => {
//   const token = req.cookies.jwt;

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized access - No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     // console.log("Decoded Token:", decoded);

//     // ✅ Ensure decoded exists before accessing `userId`
//     if (!decoded || !decoded.userId) {
//       return res.status(401).json({ message: "Invalid token data" });
//     }

//     req.user = decoded.userId;
//     next(); // ✅ Call next() only inside try block
//   } catch (error) {
//     console.error("JWT Error:", error.message);
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
export const authenticate = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.userId);
  } catch (error) {
    return res.status(401).json({ message: "" + error.message });
  }
  next();
};
