const User = require('../../models/User');

module.exports = async (req, res) => {
  let user = await User.findById(req.user.id).lean();

  res.status(200).json({ status: "success", user });
};
