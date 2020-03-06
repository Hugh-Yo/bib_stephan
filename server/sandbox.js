/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin');



async function sandbox (searchLink = 'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/') {
  try {
    var i;
    const increments = await (await michelin.scrapePage(searchLink)).nbincrements;
    for (i = 1; i <= increments; i++)
    {
      url = searchLink.concat(i);
      
      console.log('\n');
      console.log(`🕵️‍♀️  browsing ${url} source`);
      
      const restaurant = await michelin.scrapePage(url);

      console.log(restaurant);
    }    
  } catch (e)  {
    console.error(e);
    process.exit(1);
  }
}

const [,, searchLink] = process.argv;
sandbox(searchLink);
