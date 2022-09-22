var express = require('express');
var router = express.Router();
const DeviceDetector = require('node-device-detector');
const pagelist = require('../pages.json')
const checklist = require('../check_pages.json')
const fs = require('fs')
const torrentApi = require('./torrent')
const {readFile} = require('fs/promises'); // using fs-promises
const path = require('path');
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.json('home')
 
});




router.get('/page/:url' , (req, res , next) =>{
  var checkingg = torrentApi.check(req.params.url)
   if(checkingg == 'no'){ res.json('not found') } else {


   fs.readFile('check_pages.json' , (err, data) => {
    if (err) throw err;
    let list = JSON.parse(data);
    let lists = list[checkingg]
    if(lists) {
      
      if(req.params.url == lists.act){
        var links = lists.api
      const url = links
      if(url) {
         fs.readFile('pages.json' , (err, data) => {
          if (err) throw err;
          let listing = JSON.parse(data);
         (async() => {
         const result = await torrentApi.find(url)
        
        res.json(result)
          
          })(); 
        });
  
      }
      } else {
         res.redirect('/404')
      }
    } else {
      res.redirect('/404')
    }
    
  });
}
})
router.get('/pages/:act/:next/:id', (req , res , next) => {
  var id = req.params.id
  var pageNumbar = req.params.next
  var acts = req.params.act
  if(pageNumbar >= 11){
    res.json('limited')
  } else {
    fs.readFile('check_pages.json' , (err, data) => {
        if (err) res.json(err);
        let list = JSON.parse(data);
        let lists = list[id]
        var url = lists.api+'/'+pageNumbar+'/3'
        if(lists) {
          if(acts == lists.act){
            (async() => {
              const result = await torrentApi.find(url)
              res.json(result)
            })()
          } else {
            res.json('cats')
          }
        } else {
          res.json('id')
        }
      });
  }
  

})
router.get('/raadi' , (req , res , next ) => {
  
  var id = req.query.id
  var raadi = req.query.raadi
  const url = 'search/'+raadi+'/1/99/'+id
  fs.readFile('check_pages.json' , (err, data) => {
    if (err) res.json('404')
    let list = JSON.parse(data);
    let lists = list[id]
    if(lists) {
       (async() => {
          const result = await torrentApi.find(url)
          res.json(result)
        })()
    } else {
      res.json('404')
    }
       
  })
})
router.get('/details/:link' , (req , res ) => {
   (async () => {
    var data = await torrentApi.detail(req.params.link)
     if(data[0].title == 'no') {res.redirect('/404')} else {
      res.json(data)
     }
   })()
})

module.exports = router;
