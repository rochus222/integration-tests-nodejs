const mysql      = require('mysql');
const util       = require('util');

class DbDriver {
    constructor(config) {
        this.config = config;
        this.connection;
    }

    async connect() {
        this.connection = mysql.createConnection(this.config);
        await this.connection.connect();
    }

    async query(query, params = []) {
        if(!this.connection || this.connection.state === 'disconnected') {
            await this.connect();
        }
        const queryRunner = await util.promisify(this.connection.query);
        const result = await queryRunner.call(this.connection, query, params);
        return result;
    }
}

module.exports = DbDriver;