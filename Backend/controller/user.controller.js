import User from "../model/user.model.js"; // Importing the User model it is assumed as a database model
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateTokeAndSaveInCookies } from "../JWT/token.js";

// Zod schema for user validation
const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

// Register User function

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!email || !username || !password) {
      return res.status(400).json({ errors: "All fields are raquired" });
    }

    // Validate user input using Zod schema
    const validation = userSchema.safeParse({ email, username, password });

    if (!validation.success) {
      const errorMessage = validation.error.errors
        .map((error) => error.message)
        .join(", ");
      return res.status(400).json({ errors: errorMessage });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({ email, username, password: hashPassword });
    await newUser.save();

    // Generate token and save in cookies
    if (newUser) {
      const token = await generateTokeAndSaveInCookies(newUser._id, res);
      return res
        .status(201)
        .json({ message: "User registered successfully", newUser, token });
    }
  } catch (error) {
    console.log("Error in user registration:", error.message);
    res
      .status(500)
      .json({ message: "Error Registering user", error: error.message });
  }
};

//  Login User function
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ errors: "Invalid email or password" });
    }
    const token = await generateTokeAndSaveInCookies(user._id, res);
    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error logging in user", error: error.message });
  }

  console.log("Login request received");
  return res
    .status(200)
    .json({ message: "Login successful (to be implemented)" });
};

// Logout User function

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      path: "/",
    });
    return res.status(200).json({ message: "User Logout Successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error logging out user", error: error.message });
  }
};
