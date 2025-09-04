import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    uri: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    capturedAt: { type: Date, required: true },
    address: { type: String },
    notes: { type: String },
    isProfilePicture: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default (mongoose.models.Photo as mongoose.Model<any>) || mongoose.model("Photo", photoSchema);
