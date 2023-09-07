import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticationMiddleware = (req, res, next) => {
  const authCookie = req.cookies._auth;

  if (req.url.endsWith("/signin") || req.url.endsWith("/signup")) {
    next();
    return;
  }

  if (!authCookie) {
    return res
      .status(401)
      .send({ message: "You are not authorized to access the API." });
  }

  try {
    jwt.verify(authCookie, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid token." });
  }
};

export default authenticationMiddleware;
