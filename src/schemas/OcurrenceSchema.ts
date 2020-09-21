import mongoose from 'mongoose';

const OcurrenceSchema = new mongoose.Schema({
  zip_code: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
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
    required: false,
    default: null,
  },
  complement: {
    type: String,
    required: false,
    default: null,
  },
  ocurred_at: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  anonymous: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Ocurrence', OcurrenceSchema);
