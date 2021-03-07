if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const fs = require('fs');
const chalk = require('chalk');

const { response } = require('express');
const express = require('express');
const request = require('request');
const app = express();
const port = 5000;

const getActualRequestDurInMilliseconds = start => {
    const NS_PER_SEC = 1e9; // convert to nanoseconds
    const NS_TO_MS = 1e6 // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}

let demoLogger = (req, res, next) => {
    let current_datetime = new Date();
    let formatted_date =
        current_datetime.getFullYear() + "-" +
        (current_datetime.getMonth() + 1) + "-" +
        current_datetime.getDate() + " " +
        current_datetime.getHours() + ":" +
        current_datetime.getMinutes() + ":" +
        current_datetime.getSeconds();
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    const start = process.hrtime();
    const durationInMilliseconds = getActualRequestDurInMilliseconds(start);
    let log = `[${chalk.blue(formatted_date)}] ${method}: ${url} ${status} ${chalk.red(durationInMilliseconds.toLocaleString() + "ms")}`;
    console.log(log);
    fs.appendFile("request_logs.txt", log +  "\n", err => {
        if(err) {
            console.log(err);
        }
    });
    next();
}

app.use(demoLogger);


app.get('/', function (req, res) {
    res.send('express response home here');
});

app.get(
    '/b/country/:country/category/:category/pagesize/:pagesize',
    function (req, res) {
        console.log("got request. wow!");
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