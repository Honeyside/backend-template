const User = require('../../../models/User');

module.exports = async (req, res) => {
  let result;

  try {
    result = await User.findById(req.fields.user, { lastOnline: 1 }).lean();
  } catch (e) {
    return res.status(500).json({ status: "error", message: 'database read error' });
  }

  res.status(200).json({ status: "success", result });
};
