const express = require('express');
const router = express.Router();
const db = require('../db/sequelize');
const { Book } = db.models;

router.get('/books?', async (req,res) => {
  const getId = await Book.findOne({
    attributes: ['id'],
    order: [ ['id']],
  });
  const { id } = getId.toJSON();
  res.redirect(`/books/${id}`);
})

router.get('/books/:id', async (req, res, next) => {
  try{

    if(isNaN(req.params.id)) return next();
    const book = await Book.findByPk(req.params.id);
    res.locals.data = book.toJSON();
    res.render('book_detail');

  }catch(err){

    res.render('error');
    
  }
})

router.put('/books/:id', async (req, res) => {
  const { title, author, genre, year } = req.body;
  const { id } = req.params;

  try {
    await Book.update({
      title: title,
      author: author,
      genre: genre,
      year: year
    },
    { 
      where : { id : id }
    }
    );
    res.redirect(`/`);

  }catch(err){
    res.locals.err = err.errors;
    res.locals.data = { title ,author ,genre ,year ,id };
    res.render(`book_detail`);
    
  }
});

router.get('/books/new',  (req, res) => res.render('new_book'));

router.post('/books/new',  async (req, res) => {
  const { title , author , genre, year} = req.body;

  try{

    await Book.create({
      title: title,
      author: author,
      genre: genre,
      year: year
    });
    res.redirect('/');

  }catch(err){

    res.locals.err = err.errors;
    res.locals.value = { title, author ,genre ,year };
    res.render('new_book');
  }
});

router.post('/books/:id/delete', async (req, res) => {

  await Book.destroy({
    where: {
        id: `${req.params.id}`
    }
  });

  res.redirect('/');
})

module.exports = router;