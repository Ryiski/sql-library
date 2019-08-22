const express = require('express');
const db = require('../db/sequelize');
const findAll = require('../custom-exports/findAll');

const { Book } = db.models;
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/search',async (req,res) => {
    try{
      let { title } = req.query;
      // if true then respond with json 
      if(title){
  
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
        // else if its a submited get request then call findAll funtion 
      }else{
        findAll(req,res,`/search?get=${req.query.get}&page=`,{
            title: {
              [Op.like]: `%${req.query.get}%`
            }
          })
      }
    }catch(err){
      res.render('error')
      console.log('something went worng ' + err);
    }
  })
  
router.get('/ad-search',async (req,res) => {
    const { title,author,genre,year } = req.query;
    console.log(req.query);

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
    }}).then(c => {
    console.log(`Output => : c`, c);
      
      res.json(c)
    })
});
  
router.get('/ad-Search/show', (req,res) => {
  
  const {title,author,genre,year} = req.query;
    const path = `/ad-Search/show?title=${title}&author=${author}&genre=${genre}&year=${year}&page=`;
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
});

module.exports = router;