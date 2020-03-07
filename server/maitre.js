const axios = require('axios');
const cheerio = require('cheerio');
const querystring = require('querystring');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */

/*const restaus = data => {
    const $ = cheerio.load(data);
    return $('body > div.col-md-3.annuaire_sidebar > form > div > div > div.hide_desk.title1.filtres > div').text();
  }*/

const parsePage = data =>{

    const $ = cheerio.load(data);
    const nbrestau = parseInt($('body > div.col-md-3.annuaire_sidebar > div > div.col-md-12 > div.title1.nbresults.hide_desk').text().replace(/\s+/g, ' ').trim().split(' ')[0]);
    const nbincrements = Math.floor(nbrestau/10)+1;
    var names = [];
  
    $('body > div.col-md-9 > div.annuaire_result_list > div > div.single_desc > div.single_libel > a').each((i,element)=>{
      var name = $(element).text().replace(/\s+/g, ' ').trim().toLowerCase();
      var temp = [];
      
      var j = 0;

      while(name.charAt(j) != '(')
      {
        temp.push(name.charAt(j));
        j++;      
      }
      name = temp.join('').trim();
      names.push(name);
    });
    

    return {nbincrements, names};
  };

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */

module.exports.scrapePage = async page => {
    
    const payload = {
        'page' : page,
        'request_id' : '1523f2bf6103ad4d27efbe0762b88aa0'
    };

    const options = {
        'url':'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult',
        'method' : 'POST',
        'headers' : {'content-type':'application/x-www-form-urlencoded'},
        'data' : querystring.stringify(payload)
    };

    const response = await axios(options);
    const {data,status}=response;

    if(status >= 200  && status <300){
        return parsePage(data);
    }
    console.error(status);
    return null;
}

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */