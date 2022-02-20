import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const AuthCodeSchema = new Schema({
  expires: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: ObjectId,
    ref: 'User',
    required: false,
  },
  code: String,
  valid: Boolean,
  email: String,
});

const AuthCode = mongoose.model('AuthCode', AuthCodeSchema);

export default AuthCode;
