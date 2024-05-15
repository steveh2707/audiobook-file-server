import Database from 'better-sqlite3'

const db = new Database('appdata/app.db')
const log = console.log.bind(console);

function databaseExists() {
    const query = `
    SELECT name FROM sqlite_master WHERE type='table' AND name='audiobooks';
`
    const result = db.prepare(query).all()
    return result.length > 0
}

function createDatabase() {
    const query = `
    CREATE TABLE audiobooks (
        id INTEGER PRIMARY KEY,
        author STRING NOT NULL,
        title STRING NOT NULL,
        series STRING,
        numInSeries STRING,
        filePath STRING NOT NULL,
        filePathEncoded STRING NOT NULL,
        fileName STRING NOT NULL,
        imagePath STRING,
        fileSizeMB INT,
        dateAdded DATE NOT NULL
    )
    `
    db.exec(query)
}

function addBookToDatabase(book) {
    const insertBook = db.prepare(`
        INSERT INTO audiobooks (author, title, series, numInSeries, filePath, filePathEncoded, fileName, imagePath, fileSizeMB, dateAdded)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    insertBook.run(book.author, book.title, book.series, book.numInSeries, book.filePath, book.filePathEncoded, book.fileName, book.image, book.fileSizeMB, String(book.dateAdded))
}

function getBooksFromDatabase() {
    const query = 'SELECT * FROM audiobooks'
    return db.prepare(query).all()
}

function getBookByFilePath(filePath) {
    const query = `SELECT * FROM audiobooks WHERE filePath = ?`
    return db.prepare(query).get(filePath)
}

function deleteBookByFilePath(filePath) {
    const query = 'DELETE FROM audiobooks WHERE filePath = ?'
    return db.prepare(query).run(filePath)
}

export { databaseExists, createDatabase, addBookToDatabase, getBooksFromDatabase, getBookByFilePath, deleteBookByFilePath }
