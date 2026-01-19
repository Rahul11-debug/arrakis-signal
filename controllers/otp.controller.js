import User from '../models/User.js';
import { generateOTP } from '../utils/otp.js';
import { sendMail } from '../utils/mail.js';
import jwt from 'jsonwebtoken';

const token = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn:'1d' });


export const sendOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message:'User not found' });

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000; 
  await user.save();

  await sendMail(
    user.email,
    'Your Login OTP',
    `Your OTP is ${otp}. It is valid for 5 minutes.`
  );

  res.json({ message:'OTP sent to email' });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (
    !user ||
    user.otp !== otp ||
    user.otpExpiry < Date.now()
  ) {
    return res.status(400).json({ message:'Invalid or expired OTP' });
  }

  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({
    token: token(user._id),
    user
  });
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    await sendMail(
      user.email,
      'Your OTP (Resent)',
      `Your OTP is ${otp}. It is valid for 5 minutes.`
    );

    res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('RESEND OTP ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};
