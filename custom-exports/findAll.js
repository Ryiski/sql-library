const db = require('../db/sequelize');
const { Book } = db.models;

/**
 * Books findAll function renders all_books 
 * if success else renders error if fail
 * @param {*} req will take req object
 * @param {*} res will take res object
 * @param {*} urlPath should take a string of url path 
 *            which will be added to the pagination hyperlink 
 *            eg "/search?get=game&page="
 *            Note:- "&page=" should be the last query
 * @param {*} whereCon should take in a object of sequelize conditions 
 */

const findAll = async (req,res, urlPath = '?page=', whereCon) => {
  try{
    let page = req.query.page;
  
    page === undefined? 
    page = 0: 
    page = req.query.page - 1;
  
    const limit = 10;
    const offset = page * limit;
  
    
    const paganation = Book.count({where:whereCon}).then(c => c);
    const books = Book.findAll({
      where:whereCon,
      offset, 
      limit 
    });

    await Promise.all([paganation,books])
      .then(results => {
        res.locals = {
          data: results[1].map(book => book.toJSON()),
          count: [],
          path: urlPath
        };
        for(var i = 1;i<=Math.ceil(results[0]/ limit); i++)
        res.locals.count.push(i);
      });
    res.render('all_books');
  }catch(err){
    res.render('error');
    console.log('something went worng ' + err);
  }
}

module.exports = findAll