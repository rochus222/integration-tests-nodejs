delete require.cache[require.resolve('mysql')]
const mysql      = require('mysql');
const util       = require('util');

class DbDriver {
    constructor(config) {
        this.config = config;
        this.connection;
    }

    async connect() {
        this.connection = mysql.createConnection(this.config);

        this.connection.connectPromise = (await util.promisify(this.connection.connect)).bind(this.connection);

        await this.connection.connectPromise();

        Object.keys(this.connection.__proto__).forEach(async key => {
            if(typeof this.connection.__proto__[key] === 'function')
                this.connection[`${key}Promise`] = (await util.promisify(this.connection[key])).bind(this.connection);    
        });
    }

    async query(query, params = []) {
        if(!this.connection || this.connection.state === 'disconnected') {
            await this.connect();
        }
        return this.connection.queryPromise(query, params);
    }
}

module.exports = DbDriver;