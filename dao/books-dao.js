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
}

module.exports = BooksDao;