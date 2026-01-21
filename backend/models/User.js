import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,   
    },
    password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['citizen', 'staff', 'admin'],
    default: 'citizen',
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpiry: {
    type: Date,
  },
}, {
  timestamps: true,
});

schema.pre('save', async function () {
    if (!this.isModified('password')) {
    return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

schema.methods.matchPassword = async function (pw) {
    return await bcrypt.compare(pw, this.password);
};

export default mongoose.model('User', schema);