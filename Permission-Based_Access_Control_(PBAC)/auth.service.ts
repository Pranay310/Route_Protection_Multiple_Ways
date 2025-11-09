const payload = {
  id: user.id,
  email: user.email,
  permissions: user.permissions, // Comes from DB
};

return {
  access_token: jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  }),
};
