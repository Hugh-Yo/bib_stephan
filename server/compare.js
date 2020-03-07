const michelin = require('./michelin');
const maitre = require('./maitre');

async function sandboxx (searchLink = 'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/') {
  try {
    var names_michelin = [];
    var i;
    const increments = await (await michelin.scrapePage(searchLink)).nbincrements;
    for (i = 1; i <= increments; i++)
    {
      url = searchLink.concat(i);
      
      console.log('\n');
      console.log(`🕵️‍♀️  browsing ${url} source`);
      
      const restaurant = await michelin.scrapePage(url);

      names_michelin.push(restaurant.names);
    }   
    return {names_michelin}; 
  } catch (e)  {
    console.error(e);
    process.exit(1);
  }
}

async function sandboxx_maitre (searchLink = 1) {
    try {
      var names_maitre = [];
      var i = 1;
      const increments = await (await maitre.scrapePage(i)).nbincrements;
      for(i = 1; i <= increments; i++)
      {
        console.log(`🕵️‍♀️  browsing ${i} source`);
  
        const restaurant = await maitre.scrapePage(i);
  
        names_maitre.push(restaurant.names);
      }
      return {names_maitre};
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

const [,, searchLink] = process.argv;

async function compare (searchLink, sl2)
{
    try
    {
        var mich_names = await sandboxx(searchLink);
        var maitre_names = await sandboxx_maitre(sl2);
        var temp_michelin = [];        
        var temp_maitre = [];

        var i = 0;
        var j = 0;

        for(i = 0; i < mich_names.names_michelin.length; i ++)
        {
            var size = mich_names.names_michelin[i].length;
            for(j = 0; j < size; j++)
            {
                temp_michelin.push(mich_names.names_michelin[i][j]);
            }
        }

        for(i = 0; i < maitre_names.names_maitre.length; i++)
        {
            var size = maitre_names.names_maitre[i].length;
            for(j = 0; j < size; j++)
            {
                temp_maitre.push(maitre_names.names_maitre[i][j]);
            }
        }
        var res = [];

        for(i = 0; i< temp_maitre.length; i++)
        {
            for(j = 0; j< temp_michelin.length; j++)
            {
                if (temp_michelin[j] == temp_maitre[i])
                {
                    res.push(temp_michelin[j]);
                }
            }
        }
        
        console.log(res);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
      }
}

compare(searchLink, 2);
