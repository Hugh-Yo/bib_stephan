 const axios = require('axios');
const cheerio = require('cheerio');


module.exports.scrapePage = async page => {
    const paylod = {
        'page' : page,
        'request_id' : 'dfe87d20cf5857fd64ccd03cd697c471'
    };

    const options = {
        'url':'https://maitresrestaurateurs.fr/annuaire.ajax/loadresult',
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