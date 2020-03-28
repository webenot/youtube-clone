import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.connect(process.env.MONGODB_URI, mongoOptions);

const db = mongoose.connection;

const handleOpen = () => console.log('✔ Connected to db');
const handleError = (error) =>
  console.log(`❌ Error on DB Connection: ${error}`);

db.once('open', handleOpen);
db.on('error', handleError);
