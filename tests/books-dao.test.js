const BooksDao = require("../dao/books-dao");
const DbDriver = require("../util/db-driver");
const util = require("util");

class MockedDb extends DbDriver{
    async connect() {
        DbDriver.prototype.connect.call(this);
        const transactionInit = await util.promisify(this.connection.beginTransaction);
        await transactionInit.call(this.connection);
    }
    async query(...args) {
        return DbDriver.prototype.query.call(this, ...args);
    }
};

let mockedDb;

describe("Books Dao", () => {
    beforeEach(async () => {
        mockedDb = new MockedDb({
            host     : 'localhost',
            user     : 'root',
            password : 'admin',
            database : 'books'
        });
    });
    afterEach(async () => {
        const rollback = await util.promisify(mockedDb.connection.rollback);
        await rollback.call(mockedDb.connection);
    });
    
    it("always true 1", async () => {
        const booksDao = new BooksDao(mockedDb);
        await booksDao.create({name: "test", author: "test"});
        console.log(await booksDao.findAll());
    });
    
    it("always true 2", async () => {
        const booksDao = new BooksDao(mockedDb);
        await booksDao.delete(2);
        console.log(await booksDao.findAll());
    });
});