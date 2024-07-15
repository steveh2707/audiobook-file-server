import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import { bookController } from './src/BookController.js';
import { BookService } from "./src/BookService.js";
import { BookRepository } from "./src/BookRepository.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
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
app.use(express.json())

app.use(bookController(bookService));

app.listen((process.env.port || 3000), () => {
    console.log(`API listening on port: ${(process.env.port || 3000)}`)
})

export { app }