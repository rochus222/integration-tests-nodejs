const config = require("../config/config");
const BooksDao = require("../model/books");
const DbDriver = require("../util/db-driver");
const { expect } = require("chai");

class MockedDb extends DbDriver{
    async connect() {
        await DbDriver.prototype.connect.call(this);
        await this.connection.beginTransactionPromise();
        this.connection.commitPromise = () => Promise.resolve();
        this.connection.beginTransactionPromise = () => Promise.resolve();
    }
    async query(...args) {
        return DbDriver.prototype.query.call(this, ...args);
    }
};

let mockedDb, booksDao;

describe("Books Dao", () => {
    beforeEach(async () => {
        mockedDb = new MockedDb(config.dbConnection);
        booksDao = new BooksDao(mockedDb);
    });
    afterEach(async () => {
        await mockedDb.connection.rollbackPromise();
    });
    
    it("should return 3 books when 1 is added", async () => {
        await booksDao.create({name: "test", author: "test"});
        const result = await booksDao.findAll();
        expect(result.length).to.equal(3);
    });
    
    it("should return 1 book when 1 is removed", async () => {
        await booksDao.delete(2);
        const result = await booksDao.findAll();
        expect(result.length).to.equal(1);
    });

    it("should return 4 books in create many tries to create 2 books", async () => {
        const books = [
            {name: "test1", author: "test1"},
            {name: "test2", author: "test2"},
        ]
        await booksDao.createMany(books);
        const result = await booksDao.findAll();
        expect(result.length).to.equal(4);
    });
    
    it("should return 2 books in default state", async () => {
        const result = await booksDao.findAll();
        expect(result.length).to.equal(2);
    });
});