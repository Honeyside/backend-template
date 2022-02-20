import Mongo from './mongo';
import SQL from './sql';

const init = async () => {
  try {
    await Mongo.connect();
    console.log('mongo connected'.green);
  } catch (e) {
    console.log('mongo error'.red);
    process.exit(0);
  }

  try {
    await SQL.connect();
  } catch (e) {
    console.log('sql error'.red);
    process.exit(0);
  }
};

const DAO = {
  init, ...Mongo.Entities, Mongo, SQL,
};

export default DAO;
