const axios = require('axios');
const cheerio = require('cheerio')
const gis = require('async-g-i-s')
const request = require('request')


function check(slug) {
  if(slug == 'movie') {
    return 1
  } else if(slug == 'tv') {
   return 2
  }
  else if(slug == 'apps') {
    return 3
   }
   else if(slug == 'games') {
    return 4
   }
   else if(slug == 'topmovie') {
    return 5
   }
   else if(slug == 'toptv') {
    return 6
   }
   else if(slug == 'topapps') {
    return 7
   } else if(slug == 'topgames') {
    return 8
   } else {
    return 'no'
   }
   
}

const find = async (url) => {
  var link = 'https://piratebayproxy.live/'+url
  const data =[]
  try {
    let res = await axios.get(link);
      let html = res.data;
      const $ = cheerio.load(html)
      $('#searchResult tr' , html).each(function() {
      let title = $(this).find('a.detLink').text()
      let link = $(this).find('.detName a').attr('href')
      var pagges = $('#searchResult tr td[colspan="9"]').text().trim() 
      let cats = $(this).find('.vertTh > center > a').text()
      let size = $(this).find('font.detDesc').text().replace("ULed by" , "     ")
      let upload = $(this).find('font.detDesc').text().replace("Size" , "     ")
      data.push({ title, link, cats , size , upload })
 })
  return data
  } catch (error) {
    return error
  }
}

const detail = async (url) => {
  var link = 'https://piratebayproxy.live/torrent/'+url
  const data = []
  const errData = [{ title : 'no' }]
  try {
     let res = await axios.get(link);
     
      let html = res.data;
      const $ = cheerio.load(html)
      const title = $("div#title").text()
      const download = $('.download').find('a').attr('href')
      const file = $("dt:contains('Files:') + dd").text()
      const type = $("dt:contains('Type:') + dd a").text()
      const size = $("dt:contains('Size:') + dd").text()
      const by = $("dt:contains('By:') + dd a").text()
      const upload = $("dt:contains('Uploaded:') + dd").text()
      const desc = $("pre").text().trim()
      const results = await gis(`"${title.substring(0,20)}"` ,{safe:"on"});
       let images = results.slice(0, 1)
       let urls = images[0]
       data.push({ title, download, file , type , size, by, upload , desc, urls }) 
      return data

      
    }  catch (error) {
    return errData
  }
}

const details = async (url) => {
  var link = 'https://ukpiratebay.org/description.php?id='+url
  const data = []
  const errData = [{ title : 'no' }]
  try {
     let res = await axios.get(link);
     
      let html = res.data;
      const $ = cheerio.load(html)
      const title = $('h2 label#name').text()
      const download = $('label#d').find('a').attr('href')
      const type = $('dd label#cat').text()
      const size = $('dd label#size').text()
      const hash = $('dd label#ih').text()
      const bye = $('dd label#user').text()
      const upload = $('dd label#uld').text()
      const desc = $('label#descr').text()
      const results = await gis(`"${title.substring(0,20)}"` ,{safe:"on"});
      let images = results.slice(0, 1)
      let urls = images[0]
      data.push({ title, download, type,  size, hash, bye, upload, desc, urls  }) 
   
      return data

      
    }  catch (error) {
    return errData
  }
}

function paging(page) {
  var n_arr = []
  const words = page.split(" ")
  words.forEach(counts)
  function counts(count) {
    n_arr.push({ count })
  }
  return n_arr
}
module.exports = {
  find, 
  paging,
  detail,
  check
}