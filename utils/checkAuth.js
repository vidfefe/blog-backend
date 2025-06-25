import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123");
      req.userId = decoded._id;
      next();
    } catch (err) {
      return res.status(401).json({
        message: "There is no access",
      });
    }
  } else {
    return res.status(401).json({
      message: "There is no access",
    });
  }
};

export const checkAuthOptional = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    const decoded = jwt.verify(token, "secret123");
    req.userId = decoded._id;
  }
  next();
};
