const Db = require("./util/db-driver");
const BooksDao = require("./dao/books-dao");
const express = require('express')
const app = express()

const db = new Db({
    host     : 'localhost',
    user     : 'root',
    password : 'admin',
    database : 'books'
});

db.connect();

app.get('/books', async (req, res) => {
    try {
        const booksDao = new BooksDao(db);
        const result = await booksDao.findAll();
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).send('There was an error when processing request.');
    }
})
 
app.listen(3000);
