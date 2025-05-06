import mongoose, { model } from "mongoose";

const userSchema =new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['client', 'freelancer'],
    required: true,
  },
  phoneNumber: {
    type: Number,
  },
  position:{
    type : String,
  },
  twitter: {
    type: String,
  },
  linkedIn: {
    type: String,
  },
  address: {
    type: String,
  },
  web: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  profileImageId: {
    type: String,
  },  
  profileCoverImg: {
    type: String,
  },
  skills: {
    type: [String],
    default: [],
  },
  about: {
    type: String,
  },
  gitHub: {
    type: String,
  },
  pricePerHour: {
    type: Number,
  },
  projects: {
    type: [String],
    default:[]
  },
  chat: {
    type: String, 
  },
  wallet: {
    type: String,
  },
  reviews: {
    type: [String],
    default: [],
  },
  companyName:{
    type:String,
  },
  block:{
    type : Boolean,
    default : false
  }
},{timestamps:true})


userSchema.index(
  { googleId: 1 },
  { unique: true, partialFilterExpression: { googleId: { $exists: true, $ne: null } } }
);

export default mongoose.model('User', userSchema);
