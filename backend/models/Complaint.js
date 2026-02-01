import mongoose from 'mongoose';
import { resolve } from 'path';

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      lat: Number,
      lng: Number,
      adress: String,
    },
    image: {
      url: String,
      filename: String,
    },
    status: {
      type: String,
      enum: ['submitted', 'assigned', 'in-progress', 'resolved', 'closed'],
      default: 'submitted',
    },
    statusHistory: [
      {
        status: {
          type: String,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    remarks: [
      {
        message: {
          type: String,
          required: true,
        },
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        role: {
          type: String,
          enum: ['admin', 'staff'],
          required: true,
        },
      },
    ],

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    slaDeadline: {
      type: Date,
      resolvedAt:{
        type: Date,
      }
    },

    lifecycle: [
  {
    status: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  ],
  },

  
  { timestamps: true }
);

export default mongoose.model('Complaint', schema);
