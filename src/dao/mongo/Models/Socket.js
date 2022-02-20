import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const SocketSchema = new Schema({
  socket: String,
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  status: String,
  lastActive: Date,
});

const Socket = mongoose.model('Socket', SocketSchema);

export default Socket;
