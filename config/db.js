const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect("mongodb+srv://hemant:ahire@cluster0.q4s62o3.mongodb.net/Evallo", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  }
};

module.exports = dbConnection;
