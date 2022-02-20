import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const SessionSchema = new Schema({
  expires: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: false,
  },
});

const Session = mongoose.model('Session', SessionSchema);

export default Session;
