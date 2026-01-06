export const admin = (req, res, next) => {
  console.log("admin");
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};