import Models from '../Models';

const { Info } = Models;

const getCurrentVersion = async () => {
  return Info.findOne({}).sort('-version');
};

const updateCurrentVersion = ({ version, build, api }) => {
  console.log(`Installing update: build ${build} version ${version}`.cyan);
  return Info({ version, build, api }).save();
};

const Versioning = { getCurrentVersion, updateCurrentVersion };

export default Versioning;
