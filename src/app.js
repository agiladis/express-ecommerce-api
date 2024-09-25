require('dotenv').config();

const express = require('express');
const { Sequelize } = require('sequelize');
const dbConfig = require('./config/database');

const app = express();

const PORT = process.env.PORT;

// connect to db
const sequelize = new Sequelize(dbConfig.development);

// test connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database: ', err);
  });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
