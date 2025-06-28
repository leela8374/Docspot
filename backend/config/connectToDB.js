const mongoose = require('mongoose');

const connectToDB = () => {
  mongoose
    .connect(`mongodb://127.0.0.1:27017/`, {
      dbName: 'DocSpot',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      throw new Error(`Could not connect to MongoDB: ${err}`);
    });
};

module.exports = connectToDB;
