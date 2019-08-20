const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const db = require('./db/sequelize');
const methodOverride = require('method-override');
const routes = require('./routes/books');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const { Book } = db.models;
const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.use(methodOverride('_method'));
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(routes);

(async () => await db.sequelize.sync())()

app.get('/',  (req, res) => {
   findAll(req,res)
})

app.get('/search',async (req,res) => {
  try{
    // if true then respond with json 
    if(req.query.q){
      const look = await Book.findAll({
        attributes: ['title','id'],
        where: {
          title: {
            [Op.substring]: `${req.query.q}`
          }
        },limit: 3
      });
    
      const titles =  look.map(book => {
        const responed = book.toJSON();
        return responed;
      });
    
      return res.json(titles);
      // else if its a submited get request then call findAll funtion 
    }else{
      findAll(req,res,false,{
          title: {
            [Op.substring]: `${req.query.get}`
          }
        })
    }
  }catch(err){
    res.render('error')
    console.log('something went worng ' + err);
  }
})


/**
 * Books findAll function renders all_books 
 * if success else error if fail
 * @param {*} req will take req object
 * @param {*} res will take res object
 * @param {*} boolean true of false will be send to all_books templet to determen 
 * which how the pagination herfs shoud be set up
 * @param {*} whereCon should take in a object if sequelize conditions 
 */
const findAll = async (req,res, boolean = true, whereCon) => {
  try{
    let page = req.query.page;
  
    page === undefined? 
    page = 0: 
    page = req.query.page - 1;
  
    const limit = 10
    const offset = page * limit
  
    
    const paganation = Book.count({where:whereCon}).then(c => c)
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
          boolean: boolean,
          q: req.query.get
        };
        for(var i = 1;i<=Math.ceil(results[0]/ limit); i++)
        res.locals.count.push(i)
      });
    res.render('all_books')
  }catch(err){
    res.render('error')
    console.log('something went worng ' + err);
  }
}

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('page_not_found');
});
 

app.listen(app.get('port'), function () {
  console.log('Web server running on ' + `http://localhost:${app.get('port')}/ <= (CTRL + LEFT CLICK TO OPEN)`);
})
