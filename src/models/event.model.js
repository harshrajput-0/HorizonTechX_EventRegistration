import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

organizer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
    thumbnail: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const Event = mongoose.model("Event", eventSchema);