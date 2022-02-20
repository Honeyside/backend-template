import mongoose from 'mongoose';
import config from '../../../../config';

const { Schema } = mongoose;

const EmailSchema = new Schema({
  from: String,
  to: String,
  subject: String,
  template: String,
  replacements: Object,
  language: {
    type: String,
    default: 'en',
  },
  sent: {
    type: Boolean,
    default: false,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  dateSent: Date,
  env: {
    type: String,
    default: config.env,
  },
});

const Email = mongoose.model('Email', EmailSchema);

export default Email;
