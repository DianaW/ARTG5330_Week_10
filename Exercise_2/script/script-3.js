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

//A d3.map() structure to store a lookup table of countries and continents
var countryByContinent = d3.map();

//Color scale
var scaleColor = d3.scale.ordinal().domain(["Africa","Americas","Europe","Asia","Oceania"]).range(['red','blue','green','purple','yellow']);

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
    var countryName = d['Area name'],
        continent = d['Group name'];
    countryByContinent.set(countryName,continent);

    //Where is return d;?
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
    console.log(data);

    //layout
    var pie = d3.layout.pie()
        .value(function(d){ return d.values.get(2000)?d.values.get(2000):0; });

    //generator
    var arc = d3.svg.arc()
        .innerRadius(height/2-100)
        .outerRadius(height/2);

    canvas.append('g')
        .attr('class','pie')
        .attr('transform','translate('+width/2+','+height/2+')')
        .selectAll('.arc')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('class','arc')
        .attr('d',arc)
        .style('fill',function(d){
            var continent = countryByContinent.get(d.data.key);
            return scaleColor(continent);
        })
        .on('click',function(d){
            console.log(d);
        })
}