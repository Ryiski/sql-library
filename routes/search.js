const express = require('express');
const db = require('../db/sequelize');
const findAll = require('../custom-exports/findAll');
const Sequelize = require('sequelize');

const { Book } = db.models;
const router = express.Router();
const Op = Sequelize.Op;

router.get('/search',async (req,res) => {
  const {title,author,genre,year,get} = req.query;

  if(get){
    //Title Search
    findAll(req,res,`/search?get=${get}&page=`,{
      title: {
        [Op.like]: `%${get}%`
      }
    });
  }else{
    //Advanced Search
    const path = `/search?title=${title}&author=${author}&genre=${genre}&year=${year}&page=`;
    findAll(req,res,path,{
        title: {
        [Op.like]: `%${title}%`
        },
        author: {
        [Op.like]: `%${author}%`
        },
        genre: {
        [Op.like]: `%${genre}%`
        },
        year: {
        [Op.like]: `%${year}%`
        }
    });
  }
})

router.get('/live-search',async (req,res) => {
    let { title } = req.query;
  
    const look = await Book.findAll({
      attributes: ['title','id'],
      where: {
        title: {
          [Op.like]: `%${title}%`
        }
      },limit: 3
    });
  
    const titles =  look.map(book => {
      const responed = book.toJSON();
      return responed;
    });
    return res.json(titles);
})
  
router.get('/get-count',async (req,res) => {
  //Send Total found 
    const { title,author,genre,year } = req.query;

    await Book.count({where:{
        title: {
            [Op.like]: `%${title}%`
        },
        author: {
            [Op.like]: `%${author}%`
        },
        genre: {
            [Op.like]: `%${genre}%`
        },
        year: {
            [Op.like]: `%${year}%`
        }
    }}).then(c => res.json(c))
});

module.exports = router;