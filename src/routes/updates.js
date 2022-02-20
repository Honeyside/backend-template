export default (req, res) => {
  res.status(200).json([{
    timestamp: '2021-09-12T20:19:39Z',
    title: 'Welcome to Crumble!',
    content: 'Version 1.0.0 has been released.'
  }]);
};
