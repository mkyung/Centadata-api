const request = require("request")

module.exports = class {
    constructor(maxConcurrentConn){
        this.maxConcurrentConn = maxConcurrentConn
        this.queue = []
        this.currentConnections = []
        this.connectionEngine = function(){
            request
        }
    }

}