const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */

//This gets us the string containing information such as the index of the restaurants on the page, the total number of pages etc.
const restaus = data => {
  const $ = cheerio.load(data);
  return $('div.d-flex:nth-child(2) > div:nth-child(1) > h1:nth-child(1)').text().replace(/\s+/g, ' ').trim().split(' ');
}

/*
  const parse = data => {
  const $ = cheerio.load(data);
  const name = $('restaurant-details__heading.d-lg-none > h2').text();
  const experience = $('#experience-section > ul > li:nth-child(2)').text();
  const nbrestau = $('.search-results__status > div.flex-fill > h1');
  const restauppage = $('.search-results__status > div.flex-fill > h1').text().split(' sur')[0].split('1-');
 
  return {nbrestau, restauppage};
};
*/

const parsePage = data =>{

  const $=cheerio.load(data);
  const nbrestau = parseInt(restaus(data)[2]);
  //replace is used to replace all the successive spaces into a single one
  //Then trim removes the spaces at both the beginning and the end of the string, then the split allows to choose either one or 40
  const restaupagemin = parseInt(restaus(data)[0].split('-')[0]);//parseInt($('.js-restaurant__stats > h1 > span').text().replace(/\s+/g, ' ').trim().split('-')[0]);
  const restaupagemax = parseInt(restaus(data)[0].split('-')[1]);//parseInt($('.js-restaurant__stats > h1 > span').text().replace(/\s+/g, ' ').trim().split('-')[1]);
  const restauppage = restaupagemax - restaupagemin + 1;
  const nbincrements = Math.floor(nbrestau/restauppage) +1;
  const links = [];
  const names = [];
  const numbers = [];

  $('div.js-restaurant__list_item > a').each((i,element)=>{
    const link = $(element).attr('href');//we select the 'href' attribute of the element
    const name = $(element).attr('aria-label').split('Open ')[1].toLowerCase();//same thing with 'aria-label', from which is then extracted the Name
    links.push(link);
    names.push(name);
  });

  return {names,nbincrements};
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */

/*Function used to determine how many pages there are
module.exports.nbincrements = async url => {
  const response = await axios(url);
  const {data, status} = response;
  const total = parsePage(data).nbrestau;
  const restauppage = parsePage(data).restauppage;
  const res = Math.floor(total/restauppage) + 1;

  console.error(status);
  return(res);
}
 */

module.exports.scrapePage = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) 
  {
    return parsePage(data);    
  }

  console.error(status);
  return null;
};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */