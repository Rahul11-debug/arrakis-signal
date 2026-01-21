import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: String,
    message: String,
    type: {
      type: String,
      enum: ['STATUS', 'SLA', 'SYSTEM'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedComplaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', schema);
