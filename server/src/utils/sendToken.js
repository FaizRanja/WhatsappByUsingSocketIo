const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // Define a default value for COOKIE_EXPIRE if not set
  const cookieExpireDays = process.env.COOKIE_EXPIRE ? parseInt(process.env.COOKIE_EXPIRE) : 7; // Default to 7 days

  // Option for cookies
  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
    token,
  });
  
};

module.exports = sendToken;
