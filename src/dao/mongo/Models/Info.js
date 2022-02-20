import mongoose from 'mongoose';

const { Schema } = mongoose;

const InfoSchema = new Schema({
  version: String,
  build: Number,
  api: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Info = mongoose.model('Info', InfoSchema);

export default Info;
