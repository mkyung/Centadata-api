const ConnectionPool = require("../lib/common/connection-pool")

test("get pool current connections", () => {
    var pool = new ConnectionPool(1)
    expect(pool.getCurrentConnections()).toBeInstanceOf(Array)
})

test("get pool queue", () => {
    var pool = new ConnectionPool(1)
    expect(pool.getQueue()).toBeInstanceOf(Array)
})

test("set connection engine", () => {
    var engine = function(){}()
    var pool = new ConnectionPool(1)
        .setConnectionEngine(engine)
    expect(pool.getConnectionEngine()).toStrictEqual(engine)
})

test("set pool size limit to 1", () => {
    var pool = new ConnectionPool(1)
        .setConnectionEngine(() => {
            return new Promise(resolve => setTimeout(resolve, 1000))
        })
    pool.getHttp("abc.com")
    pool.getHttp("def.com")
    expect(pool.getQueue().length).toEqual(1)
    expect(pool.getCurrentConnections().length).toEqual(1)
})