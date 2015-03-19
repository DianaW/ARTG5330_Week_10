/*Start by setting up the canvas */
var margin = {t:100,r:50,b:200,l:50},
    width = $('.canvas').width() - margin.l - margin.r,
    height = $('.canvas').height() - margin.t - margin.b;


//Set up SVG drawing elements -- already done
var svg = d3.select('.canvas')
    .append('svg')
    .attr('width', width + margin.l + margin.r)
    .attr('height', height + margin.t + margin.b)
    .append('g')
    .attr('transform','translate('+margin.l+','+margin.t+')');


//Global variables
var yVariable = "CO2 emissions (kt)",
    y0 = 1990,
    y1 = 2013;


//d3.map for metadata
var metaDataMap = d3.map();

//Layout function here


//START!
queue()
    .defer(d3.csv, "data/00fe9052-8118-4003-b5c3-ce49dd36eac1_Data.csv",parse)
    .defer(d3.csv, "data/metadata.csv", parseMetaData)
    .await(dataLoaded);

function dataLoaded(err, rows, metadata){


    rows.forEach(function(row){
        row.region = metaDataMap.get(row.key);
    });

    //Then create hierarchy based on regions
    var data = d3.nest()
        .key(function(d){
            return d.region;
        })
        .entries(rows);


    var root = {
        key:"regions",
        values: data
    };

    draw(root);
}

function draw(root){

}

function parse(d){
    var newRow = {
        key: d["Country Name"],
        series: d["Series Name"],
        data:d3.map()
    };
    for(var i=1990; i<=2013; i++){
        var heading = i + " [YR" + i + "]";
        newRow.data.set(
            i,
            (d[heading]=="..")?0:+d[heading]
        );
    }

    return newRow;
}

function parseMetaData(d){
    var countryName = d["Table Name"];
    var region = d["Region"];
    metaDataMap.set(countryName, region);
}