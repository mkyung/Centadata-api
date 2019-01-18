
// HK, KL etc
class RegionManager{
    constructor(region){
        this.region = region
        this.url = urlLevel1 + region
        this.children = []
    }


    async getChildren(){
        var body = await getHttp(this.url).catch((err) => {
            console.error(err)
        })
        var queue = []
        var str = iconv.decode(new Buffer(body), "big5")
        var $ = cheerio.load(str,
            { decodeEntities: false })

        $(".tbreg1>tbody>tr").each((i,e) => {
            let regionName = $(e).find(".tdreg1cname span").text()
            let paramsText = $(e).attr("onclick")
            let params = extractParams(paramsText)
            let level2Manager = new Level2Manager(params[0],params[1],params[2],params[3],params[4],regionName)
            
            this.children.push(level2Manager)
            queue.push(level2Manager.getChildren())
        })

        await Promise.all(queue)
        return this
    }

    print(indent = 0){
        writer.print(INDENT_SYMBOL.repeat(indent) + "Region: " + this.region)
        for (var i = 0; i<this.children.length; i++){
            this.children[i].print(indent + INDENT_LEVEL)
        }
    }

}