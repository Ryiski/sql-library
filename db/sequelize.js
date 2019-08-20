const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'library.db',
    logging: false

});

const db = {
  sequelize,
  Sequelize,
  models: {},
};

sequelize.query("UPDATE SQLITE_SEQUENCE SET SEQ=0");

db.models.Book = require('./models/book.js')(sequelize);

module.exports = db;