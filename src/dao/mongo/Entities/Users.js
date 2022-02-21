import argon2 from 'argon2';
import Models from '../Models';
import config from '../../../../config';

const { User } = Models;

const updateRootUser = async () => {
  const rootUser = config.rootUser || {};

  rootUser.username = (rootUser.username || 'root').toLowerCase();

  let user;

  user = await User.findOne({ username: rootUser.username || 'root' });

  if (!user) {
    user = await User.findOne({ email: rootUser.email || 'root' });
  }

  const hash = await argon2.hash(rootUser.password || 'root');

  if (!user) {
    await User.deleteMany({ roles: { $in: ['root'] } });

    return User({
      username: rootUser.username || 'root',
      password: hash,
      firstName: rootUser.firstName || 'Admin',
      lastName: rootUser.lastName || 'User',
      email: rootUser.email || 'admin@example.com',
      roles: ['root', 'admin'],
    }).save();
  }
  return User.findOneAndUpdate({
    username: user.username,
  }, {
    $set: {
      password: hash,
      firstName: rootUser.firstName || 'Admin',
      lastName: rootUser.lastName || 'User',
      email: rootUser.email || 'admin@example.com',
      roles: ['root', 'admin'],
    },
  });
};

const findUserByUsername = async (username) => {
  return User.findOne({ username });
};

const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

const findUserById = async (id) => {
  return User.findById(id);
};

const insertUser = async (data) => {
  const hash = await argon2.hash(data.password);

  return User({
    username: data.username,
    password: hash,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    roles: data.roles,
    preference: data.preference,
  }).save();
};

const findUsers = (query, sort, limit) => {
  return User.aggregate().project({
    _id: 0,
    id: '$_id',
    username: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    roles: 1,
    fullName: { $concat: ['$firstName', ' ', '$lastName'] },
    registrationDate: 1,
    lastLogin: 1,
  }).match(query).sort(sort)
    .limit(limit || 500)
    .exec();
};

const Users = {
  updateRootUser, findUserByUsername, insertUser, findUserById, findUsers, findUserByEmail,
};

export default Users;
