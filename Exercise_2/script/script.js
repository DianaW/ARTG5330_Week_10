/*Start by setting up the canvas */
var margin = {t:50,r:50,b:100,l:50};
var width = $('.canvas').width() - margin.r - margin.l,
    height = $('.canvas').height() - margin.t - margin.b;

var canvas = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');

queue()
    .defer(d3.csv,"data/FAO_world_apple_production.csv",parse)
    .defer(d3.csv,"data/FAO_area_classification.csv",parseMetadata)
    .await(dataLoaded);

function parse(d){
    return {
        areaCode: +d.AreaCode,
        areaName: d.AreaName,
        year: +d.Year,
        value: +d.Value
    };
}

function parseMetadata(d){
    return d;
}

function dataLoaded(err,data,metadata){

    //Testing out d3.nest
    //http://bl.ocks.org/phoebebright/raw/3176159/
    var nest = d3.nest()
        .rollup(function(leaves){
            var dataSeries = d3.map();

            leaves.forEach(function(leaf){
                dataSeries.set(leaf.year, leaf.value);
            });

            return dataSeries;
        })
        .key(function(d){ return d.areaName; });

    var countryData = nest.entries(data);

    draw(countryData);
}

function draw(data){

}