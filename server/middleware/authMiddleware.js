const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  //if token couldnt be found then send the error that access token required
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next){
    authenticateToken(req, res, ()=>{
        if(req.user.type != 'admin'){
            return res.status(403).json({ error: "Admin access required!" });
        }
        next();
    })
}

function optionalAuth(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
        req.user = null;
        } else {
        req.user = user;
        }
        next();
    });
}

module.exports = {
    authenticateToken,
    requireAdmin,
    optionalAuth
}