const { validateToken } = require("../service/authentication");

function checkForAuthenticationCookies(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    
    if (!tokenCookieValue) {
      return next(); // Explicitly return to avoid further execution
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload; // Attach the user payload to the request object
    } catch (error) {
      console.error("Invalid token:", error.message);
    }

   return next(); // Call next middleware
  };
}

module.exports = {
  checkForAuthenticationCookies,
};
