if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const { response } = require('express');
const express = require('express');
const request = require('request');
const app = express();
const port = 5000;

app.get('/', function (req, res) {
    res.send('express response here');
});

app.get(
    '/b/country/:country/category/:category/pagesize/:pagesize',
    function (req, res) {
        const { country, category, pagesize } = req.params;
        request(
            `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pagesize=${pagesize}&apiKey=${process.env.apiKey}`,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    const newsAPIResponse = JSON.parse(body);
                    res.send({ newsAPIResponse });
                }
            }
        );
    }
);

app.listen(port, function () {
    console.log(`express server is running on port ${port}!`);
});
