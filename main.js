const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const request = require("request")
const fs = require("fs")

const districts = ["HK", "KL", "NE", "NW"]
const urlLevel1 = "http://www1.centadata.com/paddresssearch1.aspx?type=district16&code="
const urlLevel2 = "http://www1.centadata.com/paddresssearch1.aspx"
const urlLevel3 = "http://www1.centadata.com/"
const INDENT_SYMBOL = "\t"
const INDENT_LEVEL = 1



class Writer {
    constructor(writeMode){
        this.writeMode = writeMode? writeMode: Writer.writeMode.ToConsole
        if (writeMode == Writer.writeMode.ToFile){
            this.message = ""
        } else if (writeMode == Writer.writeMode.ToConsole) { 
        } else {
            throw "Writer mode cannot be set to values other than 1 or 2"
        }
    }

    static get writeMode(){
        return {
            ToFile: 1,
            ToConsole: 2
        }
    }

    print(str){
        if (this.writeMode == Writer.writeMode.ToFile){
            this.message += str + "\n"
        } else if (this.writeMode == Writer.writeMode.ToConsole){
            console.log(str)
        }
    }
    
    flush(path){
        if (this.writeMode == Writer.writeMode.ToFile){
            fs.writeFileSync(path, this.message, (err) => {
                console.err(err)
            })
            console.log("File written to " + path)
        } else {
            throw "Writer not in file mode"
        }
    }

}

function getHttp(url){
    return new Promise((resolve, reject) => {
        request({
            url: url,
            encoding: null}, // Important
            function(err, resp, body){
                if (err != null){
                    return reject(err)
                }
                resolve(body)
            }
        )
    })
}

function extractParams(paramsText){

    let params = []
    while (paramsText.match(/'([^']+)'/) != null && paramsText.match(/'([^']+)'/).length > 0){
        let matches = paramsText.match(/'([^']+)'/)
        params.push(matches[1])
        paramsText = paramsText.replace(matches[0], "")
    }
    return params
}

// HK, KL etc
class Level1Manager{
    constructor(district){
        this.district = district
        this.url = urlLevel1 + district
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
        writer.print(INDENT_SYMBOL.repeat(indent) + "Region: " + this.district)
        for (var i = 0; i<this.children.length; i++){
            this.children[i].print(indent + INDENT_LEVEL)
        }
    }

}

// Kwun Tong, Fanling etc
class Level2Manager {
    constructor(atype,acode,acode2,ainfo,apage, regionName){
        this.url = Level2Manager.makeUrl(atype, acode, acode2, ainfo,apage)
        this.regionName = regionName
        this.children = []

        this.pageParams = [atype,acode,acode2,ainfo,apage]
    }

    static makeUrl(atype,acode,acode2,ainfo,apage){
		if(apage < 0 || apage > 1000 || apage =='undefined')apage=0;
		return urlLevel2 + "?type="+atype+"&code="+acode+"&info=" + ainfo + "&code2="+acode2 + "&page="+apage;
    }

    
    async getChildren(){
        var toLoop = true
        let maxPage = 100
        var toLoadPage = 0

        while(toLoop && toLoadPage <= maxPage){
            var body = await getHttp(this.url).catch((err) => {
                console.error(err)
            })
            var str = iconv.decode(new Buffer(body), "big5")
            var $ = cheerio.load(str,
                { decodeEntities: false })

            // next page button
            var $nextBtn = $("td[align=right] a").last()
            if ($nextBtn.html() == null || !$nextBtn.html().includes("???")){
                toLoop = false
            } else {
                let paramsText = $nextBtn.attr("href")
                let params = extractParams(paramsText)
                toLoadPage = parseInt(params[2])
                this.url = Level2Manager.makeUrl(this.pageParams[0], this.pageParams[1], this.pageParams[2], this.pageParams[3], toLoadPage)
            }

            $(".tbscp1>tbody>tr").each((i,e) => {
                let $el = $(e)
                let estateName = $el.find(".tdscp1cname span").text()
                let addr = $el.find(".tdscp1addr").text()
                let bldAge = $el.find(".tdscp1bldgage").text()
                let usablePrice = $el.find(".tdscp1Suprice").text()
                let paramsText = $el.attr("onclick")
                let params = extractParams(paramsText)
                let centaCode = params[1]
                let level3Manager = new Level3Manager(
                    params[0],
                    params[1],
                    params[2],
                    params[3],
                    null,
                    estateName,
                    addr,
                    bldAge,
                    usablePrice
                )

                this.children.push(level3Manager)
            })
        }
        return this
    }

    print(indent = 0){
        writer.print(INDENT_SYMBOL.repeat(indent) + "District: " + this.regionName)
        for (var i = 0; i<this.children.length; i++){
            this.children[i].print(indent + INDENT_LEVEL)
        }
    }
}

// represent each xx Garden, xx Court
class Level3Manager {
    constructor(atype,acode,ainfo,apage, aref, estateName, addr, bldAge, usablePrice){
        this.url = Level3Manager.makeUrl(atype, acode, ainfo, apage,aref)
        this.estateName = estateName
        this.addr = addr
        this.bldAge = bldAge
        this.usablePrice = usablePrice
    }

    static makeUrl(atype,acode,ainfo,apage, aref){
		if(apage < 0 || apage > 1000 || apage =='undefined')apage=0;
		return urlLevel3 + "ptest.aspx?type="+atype+"&code="+acode+"&info=" + ainfo + "&page="+apage + "&ref=" + aref;
    }
    
    print(indent = 0){
        writer.print(INDENT_SYMBOL.repeat(indent) + "Property: " + this.estateName)
        writer.print(INDENT_SYMBOL.repeat(indent + INDENT_LEVEL) + "Address: " + this.addr)
        writer.print(INDENT_SYMBOL.repeat(indent + INDENT_LEVEL) + "Building Age: " + this.bldAge)
        writer.print(INDENT_SYMBOL.repeat(indent + INDENT_LEVEL) + "Recent price per ft: " + this.usablePrice)
    }
}

var managers = []
var queue = []
var writer = new Writer(Writer.writeMode.ToFile)

for (var i = 0; i< districts.length; i++){
    let manager = new Level1Manager(districts[i])
    queue.push(manager.getChildren())
    managers.push(manager)
}

Promise.all(queue).then((values) => {
    for (idx in managers){
        let manager = managers[idx]
        manager.print(0)
    }

    writer.flush("./property-list.txt")
})
