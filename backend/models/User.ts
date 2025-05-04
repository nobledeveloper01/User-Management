import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['ADMIN', 'USER'], // Match GraphQL enum
      default: 'USER' // Uppercase to match enum
    },
    status: { 
      type: String, 
      enum: ['ACTIVE', 'INACTIVE'], // Match GraphQL enum
      default: 'ACTIVE' // Uppercase to match enum
    },
    profilePhoto: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);


userSchema.index({ name: 'text', email: 'text' }); // For text search
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1, status: 1 });
export default mongoose.model("User", userSchema);
