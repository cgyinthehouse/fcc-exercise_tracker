import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  log: {
    type: [exerciseSchema],
  },
});

export const User = mongoose.model("user", userSchema);
export const Exercise = mongoose.model("exercise", exerciseSchema);
