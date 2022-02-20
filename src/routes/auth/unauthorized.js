export default (req, res) => {
  return res.status(401).json({ status: 'unauthorized', message: 'missing or invalid token' });
};
