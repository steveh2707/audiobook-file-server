const express = require('express')
const fs = require("fs");
const path = require("path");
const app = express()
const nunjucks = require("nunjucks")
const { findM4bFiles, sortByAuthor } = require("./utils");

const DIRECTORY_PATH = './data';

let m4bFiles = []

const appViews = path.join(__dirname, '/views')
const nunjucksConfig = {
    autoescape: true,
    noCache: true,
    express: app
}
nunjucks.configure(appViews, nunjucksConfig)
app.set('view engine', 'html')

app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));

app.get('/', (req, res) => {
    res.render('index', {audiobooks: m4bFiles})
})

app.get('/refresh', (req, res) => {
    console.log("starting search")
    m4bFiles = findM4bFiles(DIRECTORY_PATH);
    res.redirect("/")
})

app.get('/download', (req, res) => {
    let filePath = decodeURI(req.query.filePath)
    fs.stat(filePath, (error, stats) => {
        if (error) {
            console.log(error);
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 Not Found\n');
            res.end();
        }
        else {
            const stream = fs.createReadStream(filePath);
            res.writeHead(200, {
                'Content-Disposition': `attachment; filename="${req.query.fileName}"`,
                'Content-Length': stats.size
            });
            stream.pipe(res);
        }
    });
})


app.post('/test', (req,res) => {
    console.log(`${new Date()} - Request received from Readarr`)
    res.send("working")
    console.log("after")
})

app.listen((process.env.port || 3000), () => {
    console.log("starting search")
    m4bFiles = findM4bFiles(DIRECTORY_PATH);

    console.log(`API listening on port: ${(process.env.port || 3000)}`)
})

module.exports = app