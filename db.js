const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://khanhnqbh00114:khanh123@cluster0.m27xh35.mongodb.net/'; // Replace with your MongoDB connection URL
const dbName = 'products'; // Replace with your database name

let db;

const connectToDatabase = async () => {
  try {
    const client = await MongoClient.connect(mongoURI, {
      useUnifiedTopology: true,
    });
    db = client.db(dbName);
    console.log('Connected to MongoDB successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; // Throw the error to indicate a failed connection
  }
};

const getDatabase = () => {
  return db;
};

module.exports = { connectToDatabase, getDatabase };
