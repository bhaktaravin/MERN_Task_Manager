import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import taskRoutes from './routes/route.js';
import mongoose from 'mongoose';


// Dotenv config
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err)); 



// Use task routes
app.use('/api', taskRoutes);
app.use('/', (req, res) => {
    res.send('Welcome to the Task Manager API');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});