export class BookRepository {

    constructor(db) {
        this.db = db
        if (!this.databaseExists()) {
            this.createDatabase()
        }
    }

    databaseExists() {
        const query = `
            SELECT name
            FROM sqlite_master
            WHERE type = 'table'
              AND name = 'audiobooks';
        `
        const result = this.db.prepare(query).all()
        return result.length > 0
    }

    createDatabase() {
        const query = `
            CREATE TABLE audiobooks
            (
                id              INTEGER PRIMARY KEY,
                author          STRING NOT NULL,
                title           STRING NOT NULL,
                series          STRING,
                numInSeries     STRING,
                filePath        STRING NOT NULL,
                filePathEncoded STRING NOT NULL,
                fileName        STRING NOT NULL,
                imagePath       STRING,
                fileSizeMB      INT,
                dateAdded       DATE   NOT NULL
            )
        `
        this.db.exec(query)
    }

    getAllBooks() {
        const query = 'SELECT * FROM audiobooks'
        return this.db.prepare(query).all()
    }

    getBookByFilePath(filePath) {
        const query = 'SELECT * FROM audiobooks WHERE filePath = ?'
        return this.db.prepare(query).get(filePath)
    }

    addBook(book) {
        const insertBook = this.db.prepare(`
            INSERT INTO audiobooks (author, title, series, numInSeries, filePath, filePathEncoded, fileName, imagePath,
                                    fileSizeMB, dateAdded)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        insertBook.run(book.author, book.title, book.series, book.numInSeries, book.filePath, book.filePathEncoded,
            book.fileName, book.image, book.fileSizeMB, String(book.dateAdded))
    }

    deleteBookByFilePath(filePath) {
        const query = 'DELETE FROM audiobooks WHERE filePath = ?'
        return this.db.prepare(query).run(filePath)
    }
}
