import express from 'express';
import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import { BookService } from "./src/BookService.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {BookRepository} from "./src/BookRepository.js";
import Database from "better-sqlite3";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIRECTORY_PATH = './data';
const app = express();

let db = new Database('appdata/app.db')
const bookRepository = new BookRepository(db);
const bookService = new BookService(bookRepository, DIRECTORY_PATH);

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
    res.render('discover', {audiobooks: bookService.getAllBooks()})
})

app.post('/read/:id', (req,res) => {
    const id = req.params.id
    bookService.markBookAsRead(id)
    res.redirect('/')
})

app.post('/unread/:id', (req,res) => {
    const id = req.params.id
    bookService.markBookAsUnread(id)
    res.redirect('/')
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

export { app }