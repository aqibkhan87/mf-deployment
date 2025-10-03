import mongoose from 'mongoose';

const mongoURI = 'mongodb+srv://aqibkhan87912:Hosting@web-app.qc3qc0y.mongodb.net/web-app-db?retryWrites=true&w=majority&appName=web-app';
// or your MongoDB Atlas URI

// Optional: set strictQuery to prevent deprecation warnings (v8+ handles this safely)
// mongoose.set('strictQuery', false);

async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

export default connectDB;
