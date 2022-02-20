const { findUserById } = require("../../../dao/users");

module.exports = async (req, res) => {
  const { id } = req.fields;

  if (!req.user.roles.includes('admin')) {
    return res.status(401).json({ status: "error", message: "must be an admin" })
  }

  let user, result;

  try {
    user = await findUserById(id);
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'database read error' });
  }

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'user not found' });
  }

  try {
    result = await user.delete();
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'database write error' });
  }

  result = result.toObject();
  result.id = result._id;

  res.status(200).json({ status: "success", result });
};
