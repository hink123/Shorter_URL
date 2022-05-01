const Url = require('../models/url');

const ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const VALID_URL_REGEX = /^(http(s)?:\/\/).*/;
const VALID_SHORT_URL = /^(http:\/\/wh\.ly\/)[a-z]{5}/;
const ADDED_CHARS = 5;

module.exports = {
    shortenUrl,
    lengthenUrl
}

// Input a URL and output a shortened URL by adding 5 random letters to http://wh.ly/
async function shortenUrl(req, res) {
    try {
        let baseUrl = req.body.url;
        let shortUrlBase = 'http://wh.ly/';
        // Verify that the URL is valid
        let validUrl = isValidUrl(baseUrl, VALID_URL_REGEX);
        // Verify that the URL has not already been shortened
        let existingRecord = await Url.findOne({shortUrl: baseUrl});

        if(validUrl && !existingRecord) {
            let shortUrl = createUrl(shortUrlBase, ADDED_CHARS);
            // Create new database entry containing the input URL and the new shortened URL
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

// Input a previously shortened URL and output the original URL
async function lengthenUrl(req, res) {
    try {
        let shortUrl = req.query.url;
        //Verify the URL matches the shortened URL format
        let validUrl = isValidUrl(shortUrl, VALID_SHORT_URL);
        // Find the corresponding document using the shortUrl input
        let urlDoc = await Url.findOne({shortUrl});

        if(!validUrl) {
            return res.render('index', {baseUrl: null, shortUrl: null, err: 'Invalid Short URL'});
        }
        if(!urlDoc) {
            return res.render('index', {baseUrl: null, shortUrl: null, err: 'Original URL Not Found'});
        } else {
            //Grab the baseUrl from the database document
            let baseUrl = urlDoc.baseUrl;
            return res.render('index', {baseUrl, shortUrl: null, err: null});
        }
    } 
    catch (err) {
        return res.json({err});
    }
}

// Verifies that a URL matches the regex condition
function isValidUrl(url, regex) {
    return url.match(regex);
}

/**
 * Creates the shortened URL by adding random letters to the constant base
 * @param {string} shortUrlBase - http://wh.ly/
 * @param {string} addedChars - the number of random letters to add to the shortUrlBase
 * @returns {string} - shortened URL
 */
function createUrl(shortUrlBase, addedChars) {
    let randomNumb;
    for(let i = 0; i < addedChars; i++) {
        randomNumb = Math.floor(Math.random()*ALPHABET.length);
        shortUrlBase += ALPHABET[randomNumb];
    }
    return shortUrlBase;
} 