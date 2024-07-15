import express from 'express';
import fs from "fs";
const router = express.Router();

const bookController = (bookService) => {

    router.get('/', (req, res) => {
        res.render('discover', {audiobooks: bookService.getAllBooks()})
    })

    router.post('/read/:id', (req, res) => {
        const id = req.params.id
        bookService.markBookAsRead(id)
        res.redirect('/')
    })

    router.post('/unread/:id', (req, res) => {
        const id = req.params.id
        bookService.markBookAsUnread(id)
        res.redirect('/')
    })

    router.post('/read-next/:id', (req, res) => {
        const id = req.params.id
        bookService.addBookToReadNext(id)
        res.redirect('/')
    })

    router.post('/read-next-remove/:id', (req, res) => {
        const id = req.params.id
        bookService.removeBookFromReadNext(id)
        res.redirect('/')
    })

    router.post('/saveorder', (req, res) => {
        const order = req.body.order
        bookService.saveReadNextOrder(order)
        res.redirect('/')
    })

    router.get('/download', (req, res) => {
        let filePath = decodeURI(req.query.filePath)
        fs.stat(filePath, (error, stats) => {
            if (error) {
                console.log(error);
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('404 Not Found\n');
                res.end();
            } else {
                const stream = fs.createReadStream(filePath);
                res.writeHead(200, {
                    'Content-Disposition': `attachment; filename="${req.query.fileName}"`,
                    'Content-Length': stats.size
                });
                stream.pipe(res);
            }
        });
    })

    return router
}

export { bookController };