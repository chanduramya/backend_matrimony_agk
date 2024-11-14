// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();


const app = express();


// Middleware to parse JSON bodies
app.use(express.json());
const cors =require('cors')
app.use(cors())
// MongoDB connection
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.log('Failed to connect to MongoDB:', err));
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((error) => {
//       console.error('Failed to connect to MongoDB:', error);
//     });
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
    useNewUrlParser: true,  // You can omit this if you're using MongoDB driver 4.x+
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Failed to connect to MongoDB:', error));
  
// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// app.get('', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
//   });
// app.use(express.static(path.join('D:\chandu react practice work\nodejs_mongo db\build', 'build')));