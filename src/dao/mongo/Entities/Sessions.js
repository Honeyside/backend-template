import Models from '../Models';

const { Session } = Models;

const deleteSessions = async () => {
  await Session.deleteMany({ expires: { $lte: Date.now() } });
};

const findSession = (signature) => {
  return Session.findOne({ signature, expires: { $gt: Date.now() } });
};

const Sessions = { deleteSessions, findSession };

export default Sessions;
