import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // 🍪 Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    // 🔐 Verify JWT using the same secret used during login
    const decode = await jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // 📌 Attach user ID from token to request object for later use
    req.id = decode.userId;

    next(); // ✅ Proceed to protected route
  } catch (error) {
    console.log(error);
  }
};
export default isAuthenticated;
