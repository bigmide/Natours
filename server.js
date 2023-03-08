const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.error(`💥 Error Name: ${err.name}`);
  console.error(`💥 Error Text: ${err.message}`);
  console.error(`💥 Error Stack: ${err.stack}`);
  console.error('💥 UNHANDLED Exception! Shutting down!');
  process.exit(1);
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('Successfully connected to Database'));

mongoose.set('strictQuery', false);

const port = process.env.PORT;

const server = app.listen(port, '127.0.0.1', () =>
  console.log('Listening at ... http://127.0.0.1:3000')
);

process.on('unhandledRejection', (err) => {
  console.error(`💥 Error Name: ${err.name}`);
  console.error(`💥 Error Text: ${err.message}`);
  console.error(`💥 Error Stack: ${err.stack}`);
  console.error('💥 UNHANDLED REJECTION! Shutting down!');
  server.close(() => {
    process.exit(1);
  });
});
