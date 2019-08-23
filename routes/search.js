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
    findAll(req,res,`/search?get=${get.trim()}&page=`,{
      title: {
        [Op.like]: `%${get.trim()}%`
      }
    });
  }else{
    //Advanced Search
    const path = `/search?title=${title.trim()}&author=${author.trim()}&genre=${genre.trim()}&year=${year.trim()}&page=`;
    
    console.log(`Output => : path`, path);
    
    findAll(req,res,path,{
        title: {
        [Op.like]: `%${title.trim()}%`
        },
        author: {
        [Op.like]: `%${author.trim()}%`
        },
        genre: {
        [Op.like]: `%${genre.trim()}%`
        },
        year: {
        [Op.like]: `%${year.trim()}%`
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
          [Op.like]: `%${title.trim()}%`
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
            [Op.like]: `%${title.trim()}%`
        },
        author: {
            [Op.like]: `%${author.trim()}%`
        },
        genre: {
            [Op.like]: `%${genre.trim()}%`
        },
        year: {
            [Op.like]: `%${year.trim()}%`
        }
    }}).then(c => res.json(c))
});

module.exports = router;