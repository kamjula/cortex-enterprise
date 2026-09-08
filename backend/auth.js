const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_TTL = process.env.JWT_ACCESS_TTL || "15m";
const REFRESH_TOKEN_TTL = process.env.JWT_REFRESH_TTL || "7d";

function getSecret(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function issueAccessToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
      role: user.role || "Viewer",
      type: "access",
    },
    getSecret("JWT_SECRET"),
    { expiresIn: ACCESS_TOKEN_TTL }
  );
}

function issueRefreshToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      type: "refresh",
    },
    getSecret("JWT_REFRESH_SECRET"),
    { expiresIn: REFRESH_TOKEN_TTL }
  );
}

function verifyAccessToken(token) {
  const payload = jwt.verify(token, getSecret("JWT_SECRET"));
  if (payload.type !== "access") {
    throw new Error("Invalid access token");
  }
  return payload;
}

function verifyRefreshToken(token) {
  const payload = jwt.verify(token, getSecret("JWT_REFRESH_SECRET"));
  if (payload.type !== "refresh") {
    throw new Error("Invalid refresh token");
  }
  return payload;
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = {
  issueAccessToken,
  issueRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  requireAuth,
};
