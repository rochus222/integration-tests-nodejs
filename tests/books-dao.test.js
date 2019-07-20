const BooksDao = require("../dao/books-dao");
const DbDriver = require("../util/db-driver");
const util = require("util");
const expect = require("chai").expect;

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
    
    it("should return 3 books when 1 is added", async () => {
        const booksDao = new BooksDao(mockedDb);
        await booksDao.create({name: "test", author: "test"});
        const result = await booksDao.findAll();
        expect(result.length).to.equal(3);
    });
    
    it("should return 1 book when 1 is removed", async () => {
        const booksDao = new BooksDao(mockedDb);
        await booksDao.delete(2);
        const result = await booksDao.findAll();
        expect(result.length).to.equal(1);
    });
    
    it("should return 2 books in default state", async () => {
        const booksDao = new BooksDao(mockedDb);
        const result = await booksDao.findAll();
        expect(result.length).to.equal(2);
    });
});