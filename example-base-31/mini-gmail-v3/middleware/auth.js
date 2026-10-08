const jwt = require("jsonwebtoken");

function getToken(req) {
  return req.cookies && req.cookies.access_token;
}

function requireAuth(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.redirect("/login");
  }

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev-secret"
    );
    res.locals.user = req.user;
    next();
  } catch {
    res.clearCookie("access_token");
    return res.redirect("/login");
  }
}

function requireApiAuth(req, res, next) {
  const token =
    req.cookies?.access_token ||
    (req.headers.authorization || "").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      error: "Authentication required"
    });
  }

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev-secret"
    );
    next();
  } catch {
    res.status(401).json({
      error: "Invalid or expired token"
    });
  }
}

module.exports = {
  requireAuth,
  requireApiAuth
};
