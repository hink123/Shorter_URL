const { base } = require('../models/url');
const Url = require('../models/url');
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

module.exports = {
    shortenUrl,
    lengthenUrl
}

async function shortenUrl(req, res) {
    try {
        let baseUrl = req.body.url;
        let shortUrl = 'http://wh.ly/';
        let randomNumb;

        for(let i = 0; i < 5; i++) {
            randomNumb = Math.floor(Math.random()*alphabet.length);
            shortUrl += alphabet[randomNumb];
        }

        let url = new Url({baseUrl, shortUrl});
        await url.save()
        res.render('index');
    }
     catch (err) {
        console.log('Oops something went wrong!')
        res.json({err});
    }
}

async function lengthenUrl(req, res) {
    try {
        let shortUrl = req.body.url;
        let urlDoc = await Url.findOne({shortUrl});
        let baseUrl = urlDoc.baseUrl;
        res.render('index');
    } 
    catch (err) {
        console.log('Oops something went wrong!')
        res.json({err});
    }
}