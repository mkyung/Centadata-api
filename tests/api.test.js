const macroscopic = require("../lib/api/macroscopic")
const region = require("../lib/common/region")
const ApiManager = require("../lib/api-manager")

test("get default data provider from api manager", () => {
    var apiManager = new ApiManager()
    expect(apiManager.getDataProdiver()).toBeInstanceOf(CentadataProvider)
})

test("set data provider for api manager", () => {
    var centadata = new CentadataProvider()
    var apiManager = new ApiManager()
        .setDataProvider(centadata)
    expect(apiManager.getDataProdiver()).toStrictEqual(centadata)
})

test("get default connection pool from api manager", () => {
    var apiManager = new ApiManager()
    expect(apiManager.getConnectionPool()).toBeInstanceOf(ConnectionPool)
})

test("set connection pool for api manager", () => {
    var pool = new ConnectionPool()
    var apiManager = new ApiManager()
        .setConnectionPool(pool)
    expect(apiManager.getConnectionPool()).toStrictEqual(pool)
})

test("gets all properties in given regions", async () => {
    var apiManager = new ApiManager()

    await expect(macroscopic.getAllPropertiesInDistricts([region.HK])).resolves.toBeInstanceOf(Array)
})