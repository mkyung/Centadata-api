const centadata = require("../provider/centadata/provider")

// Default provider
var provider = module.exports.provider = centadata

async function getAllPropertiesInRegions(regions){
    return provider.getAllPropertiesInRegions(regions)
}

async function getAllPropertiesInDistricts(districts){
    return []
}

module.exports.getAllPropertiesInDistricts = getAllPropertiesInDistricts
module.exports.getAllPropertiesInRegions = getAllPropertiesInRegions