/*
CREATE TABLE books (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(30), 
    author VARCHAR(30)
);
*/


const db = require("./util/db-driver");
const BooksDao = require("./dao/books-dao");


async function main() {
    try {
        await db.connect();
        const booksDao = new BooksDao(db);
        console.log(await booksDao.findAll());

    } catch(err) {
        console.error(err);
    }
}

main();