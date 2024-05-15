import chokidar from "chokidar";
import {getImagePath, getNumInSeries, getSeriesName} from "./BookParser.js";

const log = console.log.bind(console);

export class BookService {
    constructor(bookRepository, directory) {
        this.bookRepository = bookRepository
        this.directory = directory
        this.directoryWatcher()
    }

    directoryWatcher() {
        const watcher = chokidar.watch(this.directory, {
            ignored: ['**/*.!(m4b)', '**/tmpfiles/**', '**/_ss/**', '**/.*'],
            persistent: true,
            awaitWriteFinish: true
        });
        log("Initialised directory watcher")
        watcher
            .on('add', (path, stats) => this.addBook(path,stats))
            .on('change', path => log(`File ${path} has been changed`))
            .on('unlink', path => this.deleteBook(path))
            .on('error', error => log(`Watcher error: ${error}`))
    }

    getAllBooks() {
        return this.bookRepository.getAllBooks()
    }

    addBook(path, stats) {
        if (this.bookRepository.getBookByFilePath(path)) {
            log(`File ${path} already exists in database`)
            return
        }

        const filePathComponents = path.split("/")
        const isBookInASeries = filePathComponents[2].includes("#")
        const fileName = filePathComponents[filePathComponents.length - 1]

        const book = {
            "author": filePathComponents[1],
            "title": fileName.split(".m4b")[0],
            "image": getImagePath(filePathComponents, "cover.jpg"),
            "series": isBookInASeries ? getSeriesName(filePathComponents[2]) : "",
            "numInSeries": isBookInASeries ? getNumInSeries(filePathComponents[2]) : "",
            "filePath": path,
            "filePathEncoded": encodeURIComponent(path),
            "fileName": fileName,
            "fileSizeMB": Math.round(stats.size / 1000000),
            "dateAdded": stats.mtime.toISOString()
        }

        this.bookRepository.addBook(book)
        log(`File ${path} added to database`)
    }

    deleteBook(path) {
        this.bookRepository.deleteBookByFilePath(path)
        log(`File ${path} deleted from database`)
    }
}

