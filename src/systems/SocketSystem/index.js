import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import DAO from '../../dao';
import config from '../../../config';

const { Socket, User } = DAO.Mongo.Models;
const { secret } = config;

let io;

const init = async (server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
    }
  });

  io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, secret, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    const user = socket.decoded;

    socket.on('session', async (data, callback) => {
      let session;

      if (data.session) {
        session = await Socket.findById(data.session._id);
        session.socket = socket.id;
        session.status = 'active';
        await session.save();
        // console.log(`socket connection recovered user ${user.username}`);
      } else {
        session = new Socket({ user: user.id, socket: socket.id, status: 'active' });
        await session.save();
        // console.log(`new socket connection user ${user.username}`);
      }

      socket.join(session._id);
      socket.join(user.id);

      callback({ success: true, status: 'success', session });
    });

    socket.on('disconnect', async () => {
      await Socket.updateOne({ socket: socket.id }, { status: 'inactive', lastActive: Date.now() });

      const updateUser = await User.findById(user.id);
      updateUser.status = 'offline';
      updateUser.lastOnline = moment().toISOString();
      updateUser.count--;
      await updateUser.save();

      io.emit('offline', { id: user.id });
    });

    const updateUser = await User.findById(user.id);
    updateUser.status = 'online';
    updateUser.lastOnline = moment().toISOString();
    updateUser.count++;
    await updateUser.save();

    io.emit('online', { id: user.id });
  });

  console.log('socket system online'.green);
};

const get = () => {
  return io;
};

const SocketSystem = { init, get };

export default SocketSystem;
