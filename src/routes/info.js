import info from '../../info';

export default (req, res) => {
  res.status(200).json({
    version: info.version,
    build: info.build,
  });
};
