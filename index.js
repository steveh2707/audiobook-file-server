import express from 'express';
import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import {directoryWatcher, getBooks, initialiseDatabase} from "./src/service.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const DIRECTORY_PATH = './data';

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
    res.render('index', {audiobooks: getBooks()})
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

app.listen((process.env.port || 3000), () => {
    console.log(`API listening on port: ${(process.env.port || 3000)}`)
})

initialiseDatabase()
directoryWatcher(DIRECTORY_PATH)

export { app }