const { base } = require('../models/url');
const Url = require('../models/url');

const ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const VALID_URL_REGEX = /^(http(s)?:\/\/).*/;
const VALID_SHORT_URL = /^(http:\/\/wh\.ly\/)[a-z]{5}/;
const ADDED_CHARS = 5;

module.exports = {
    shortenUrl,
    lengthenUrl
}

async function shortenUrl(req, res) {
    try {
        let baseUrl = req.body.url;
        let shortUrlBase = 'http://wh.ly/';
        let validUrl = isValidUrl(baseUrl, VALID_URL_REGEX);
        let existingRecord = await Url.findOne({shortUrl: baseUrl});
        
        if(validUrl && !existingRecord) {
            let shortUrl = createUrl(shortUrlBase, ADDED_CHARS);
            let url = new Url({baseUrl, shortUrl});
            await url.save()
            return res.render('index', {shortUrl, baseUrl: null, err: null});
        } else {
            return res.render('index', {shortUrl: null, baseUrl: null, err: 'Invalid URL'});
        }
    }
     catch (err) {
        return res.json({err});
    }
}

async function lengthenUrl(req, res) {
    try {
        let shortUrl = req.query.url;
        let validUrl = isValidUrl(shortUrl, VALID_SHORT_URL);
        let urlDoc = await Url.findOne({shortUrl});

        if(!validUrl) {
            return res.render('index', {baseUrl: null, shortUrl: null, err: 'Invalid Short URL'});
        }
        if(!urlDoc) {
            return res.render('index', {baseUrl: null, shortUrl: null, err: 'Base URL Not Found'});
        } else {
            let baseUrl = urlDoc.baseUrl;
            return res.render('index', {baseUrl, shortUrl: null, err: null});
        }
    } 
    catch (err) {
        return res.json({err});
    }
}

function isValidUrl(url, regex) {
    return url.match(regex);
}

function createUrl(shortUrlBase, addedChars) {
    let randomNumb;
    for(let i = 0; i < addedChars; i++) {
        randomNumb = Math.floor(Math.random()*ALPHABET.length);
        shortUrlBase += ALPHABET[randomNumb];
    }
    return shortUrlBase;
} 