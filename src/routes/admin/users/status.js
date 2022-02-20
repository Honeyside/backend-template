const User = require('../../../models/User');

module.exports = async (req, res) => {
  let online;
  let busy;
  let away;

  try {
    online = (await User.find({ status: 'online' }, { _id: 1 }).lean()).map((e) => e._id);
    busy = (await User.find({ status: 'busy' }, { _id: 1 }).lean()).map((e) => e._id);
    away = (await User.find({ status: 'away' }, { _id: 1 }).lean()).map((e) => e._id);
  } catch (e) {
    return res.status(500).json({ status: "error", message: 'database read error' });
  }

  res.status(200).json({ status: "success", online, busy, away });
};
