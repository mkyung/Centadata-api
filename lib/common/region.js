class Region {
    constructor(region, enumerator){
        this.region = region
        this.enumerator = enumerator
    }

    static get HK(){
        return new Region("HK", 0)
    }

    static get KL(){
        return new Region("KL", 1)
    }

    static get NE(){
        return new Region("NE", 2)
    }

    static get NW(){
        return new Region("NW", 3)
    }
}

module.exports = Region