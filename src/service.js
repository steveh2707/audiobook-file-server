import chokidar from "chokidar";
import {databaseExists, createDatabase, addBookToDatabase, getBooksFromDatabase, getBookByFilePath} from "./db.js";
import {encodeURLWithHash, getNumInSeries, getSeriesName} from "./parser.js";

const log = console.log.bind(console);

function directoryWatcher(filePath, fileList) {
    const watcher = chokidar.watch(filePath, {
        ignored: ['**/*.!(m4b)', '**/tmpfiles/**', '**/_ss/**'],
        persistent: true,
        awaitWriteFinish: true
    });
    log("Initialised directory watcher")
    watcher
        .on('add', (path, stats) => addBook(path,stats,fileList))
        .on('change', path => log(`File ${path} has been changed`))
        .on('unlink', path => log(`File ${path} has been removed`));
}

function addBook(path, stats, fileList) {
    if (getBookByFilePath(path)) {
        log(`File ${path} already exists in database`)
        return
    }

    const filePathComponents = path.split("/")
    const isBookInASeries = filePathComponents[2].includes("#")
    const fileName = filePathComponents[filePathComponents.length - 1]

    const book = {
        "author": filePathComponents[1],
        "title": fileName.split(".m4b")[0],
        "image": encodeURLWithHash(`${filePathComponents.slice(0, -1).join('/')}/cover.jpg`),
        "series": isBookInASeries ? getSeriesName(filePathComponents[2]) : "",
        "numInSeries": isBookInASeries ? getNumInSeries(filePathComponents[2]) : "",
        "filePath": path,
        "filePathEncoded": encodeURIComponent(path),
        "fileName": fileName,
        "fileSizeMB": Math.round(stats.size / 1000000),
        "dateAdded": stats.birthtime
    }

    addBookToDatabase(book)
    log(`File ${path} added to database`)
}

function getBooks() {
    return getBooksFromDatabase()
}

function initialiseDatabase() {
    if (!databaseExists()) {
        createDatabase()
    }
}

export { directoryWatcher, initialiseDatabase, getBooks };