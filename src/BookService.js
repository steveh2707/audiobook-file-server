import chokidar from "chokidar";
import {Book} from "./Book.js";

const log = console.log.bind(console);

export class BookService {
    constructor(bookRepository, directory, converter, mover) {
        this.bookRepository = bookRepository
        this.directory = directory
        this.converter = converter
        this.mover = mover
        this.startDirectoryWatcher()
        this.lastConvertedBookPath = ""
    }

    startDirectoryWatcher() {
        const watcher = chokidar.watch(this.directory, {
            ignored: ['**/*.!(m4b|mp3)', '**/tmpfiles/**', '**/_ss/**', '**/.*'],
            persistent: true,
            awaitWriteFinish: {
                stabilityThreshold: 20000,
                pollInterval: 100
            }
        });
        log("Initialised directory watcher")
        watcher
            .on('ready', () => log('Initial scan complete. Ready for changes'))
            .on('add', (path, stats) => this.handleAddedFile(path,stats))
            .on('change', path => log(`File ${path} has been changed`))
            .on('unlink', path => this.deleteBook(path))
            .on('error', error => log(`Watcher error: ${error}`))
    }

    handleAddedFile(fileWithPath, stats) {
        if (this.bookRepository.getBookByFilePath(fileWithPath)) {
            log(`File ${fileWithPath} already exists in database`)

        } else if (fileWithPath.endsWith(".mp3")) {
            // TODO: Check if all files have been added
            // const filePathComponents = fileWithPath.split("/")
            // const directory = filePathComponents.slice(0, filePathComponents.length - 1).join("/")
            //
            // if (this.lastConvertedBookPath === directory) {
            //     return
            // }
            // const title = filePathComponents[filePathComponents.length-1].replace(/\s*\(.*?\)\s*\..*$/, '')
            // this.converter.setUpShell()
            // this.converter.mergeAndConvertToM4B(directory, title)
            // this.mover.moveProcessedFiles(directory)

            // this.lastConvertedBookPath = directory
        } else {
            const book = new Book(fileWithPath, stats)
            this.addBook(book)
        }
    }

    addBook(book) {
        this.bookRepository.addBook(book.getBookDetails())

        log(`File ${book.filePath} added to database`)
    }

    getAllBooks() {
        const now = new Date()
        const booksFromDatabase = this.bookRepository.getAllBooks()
        return booksFromDatabase.map(book => (
            {
                ...book,
                daysAgo: Math.round((now - new Date(book.dateAdded))/86400000)
            }
        ))
    }

    markBookAsRead(id) {
        this.bookRepository.updateReadStatus(id, true)
        log(`Book id ${id} marked as read`)
    }

    markBookAsUnread(id) {
        this.bookRepository.updateReadStatus(id, false)
        log(`Book id ${id} marked as unread`)
    }

    deleteBook(path) {
        if (path.endsWith(".mp3")) {
            return
        }
        this.bookRepository.deleteBookByFilePath(path)
        log(`File ${path} deleted from database`)
    }
}

