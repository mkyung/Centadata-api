## Centadata API

This is a little script written in `node.js` to scrape data off from [http://hk.centadata.com/](http://hk.centadata.com/), a major real estate agent in Hong Kong.

### What it does

It retrieves the list of all properties in Hong Kong, subdivided into different districts. The detail is down to estate level. The details include `Property name`, `Address`, `Building Age` and `Recent usage price (per feet)`.

### How to use

1. Clone this project
1. Make sure you have `node.js` and `npm` installed
1. At project root folder, run `npm install` to install the dependencies
1. Run `node main.js` to run. By default it will create a `property-list.txt`
1. Tweak the script to make your own format of output


Sample output:

    Region: HK
            District: 堅尼地城/西營盤
                    Property: 如意大樓
                            Address: 卑路乍街18A-20A號
                            Building Age: 61
                            Recent price per ft: -
                    Property: 泓都
                            Address: 堅尼地城新海旁街38號
                            Building Age: 15
                            Recent price per ft: $22651($19710~ $24281)
                    Property: 均益大廈
                            Address: 德輔道西
                            Building Age: 41~45
                            Recent price per ft: $13871($12351~ $15595)
                    Property: 嘉輝花園
                            Address: 士美非路71-77號
                            Building Age: 33
                            Recent price per ft: $19573($19573~ $19573)
                    Property: 海都樓
                            Address: 卑路乍街7-11號
                            Building Age: 53
                            Recent price per ft: -
    ...

### Disclaimer

I am not affiliated with Centadata.