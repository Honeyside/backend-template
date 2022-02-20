const DAO = require('../../dao');

module.exports = async (req, res) => {
  const { id } = req.fields;

  let user, result;

  try {
    user = await DAO.Users.findUserById(req.user.id);
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'database read error' });
  }

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'user not found' });
  }

  user.picture = id;

  try {
    await user.save();
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'database write error' });
  }

  user = await User.findById(req.user.id).lean();

  res.status(200).json({ status: "success", user });
};
