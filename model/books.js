const util = require("util");

class BooksDao {
    constructor(db) {
        this.db = db;
    }

    async findAll() {
        return this.db.query('SELECT * FROM books;');
    }

    async findOne(id) {
        return this.db.query('SELECT * FROM books WHERE id = ?;', [id]);
    }

    async create(book) {
        this.db.query("INSERT INTO books(name, author) VALUES(?,?);", [book.name, book.author]);
    }

    async delete(id) {
        return this.db.query('DELETE FROM books WHERE id = ?;', [id]);
    }

    async createMany(books) {
        try {
            await this.db.connect();
            await this.db.connection.beginTransactionPromise();

            books.forEach(async book => await this.create(book));

            await this.db.connection.commitPromise();
        } catch (err) {
            await this.db.connection.rollbackPromise;
        }
    }
}

module.exports = BooksDao;