import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  zip_code: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitutde: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  neighborhood: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  complement: {
    type: Number,
    required: false,
  },
  phone: {
    type: Number,
    required: true,
  },
});

export default mongoose.model('User', UserSchema);
