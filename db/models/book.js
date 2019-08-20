const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Books extends Sequelize.Model {}
  Books.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,     
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for "title"',
        },
        notEmpty: {
          msg: 'Please provide a value for "title"',
        },
      },
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for "author"',
        },
        notEmpty: {
          msg: 'Please provide a value for "author"',
        },
      },
    },
    genre: {
      type: Sequelize.STRING,
      defaultValue: undefined,
    },
    year: {
      type: Sequelize.INTEGER,
      defaultValue: undefined
    },
 
  },
  // Model options object
  { 
    sequelize 
  });

  return Books;
};
