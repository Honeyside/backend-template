const { findUserById } = require("../../../dao/users");

module.exports = async (req, res) => {
  const { ids } = req.fields;

  if (!req.user.roles.includes('admin')) {
    return res.status(401).json({ status: "error", message: "must be an admin" })
  }

  let user, tmp;
  const result = [];

  for (let id of ids) {
    try {
      user = await findUserById(id);
    } catch (e) {
      return res.status(500).json({ status: 'error', message: 'database read error' });
    }

    try {
      tmp = await user.delete();
    } catch (e) {
      return res.status(500).json({ status: 'error', message: 'database write error' });
    }

    tmp = tmp.toObject();
    tmp.id = tmp._id;

    result.push(tmp);
  }

  res.status(200).json({ status: "success", result });
};
