import crypto from 'crypto';
import User from '../models/User.js';
import { sendMail } from '../utils/mail.js';
import bcrypt from 'bcryptjs';

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message:'User not found' });

  const resetToken = crypto.randomBytes(20).toString('hex');

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; 
  await user.save();

 const resetLink = `http://localhost:5173/password/change/${resetToken}`;

  await sendMail(
    user.email,
    'Password Reset',
    `Reset your password using this link:\n${resetLink}`
  );

  res.json({ message:'Reset link sent to email' });
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Old and new password are required' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('CHANGE PASSWORD ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};