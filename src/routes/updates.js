export default (req, res) => {
  res.status(200).json([{
    timestamp: '2022-02-20T23:14:39Z',
    title: 'Welcome to the Honeyside Node.js backend template!',
    content: 'Version 1.0.0 has been released.',
  }]);
};
