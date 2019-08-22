const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/sequelize');
const methodOverride = require('method-override');
const booksRoutes = require('./routes/books');
const searchRoutes = require('./routes/search');
const findAll = require('./custom-exports/findAll');

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.use(methodOverride('_method'));
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(booksRoutes);
app.use(searchRoutes);

(async () => await db.sequelize.sync())()

app.get('/',  (req, res) => {
   findAll(req,res)
});

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
