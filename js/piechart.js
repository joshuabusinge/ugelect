// set the dimensions and margins of the graph
var width = 850
    height = 600
    margin = 80

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// set the color scale
var color = d3.scaleOrdinal()
  .domain(["a", "b", "c", "d", "e", "f"])
  //.range(d3.schemeDark2);
  .range(["#a50026",
  "#fee08b",
  "#f46d43",
  "#66bd63",
  "#1a9850",
  "#a6d96a"]);

// A function that create / update the plot for a given variable:
function update(data) {

   var tooltip = d3.select("body")
   .append("div")
   .style("position", "absolute")
   .style("color", "white")
   .style("z-index", "10")
   .style("visibility", "hidden")
   .style("font-size", "28px")
   .style("background", "#000")
   .text("a simple tooltip");

   
   // Compute the position of each group on the pie:
   var pie = d3.pie()
      .value(function(d) { return d.value; })

   //.sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
   var data_ready = pie(d3.entries(data))

   // map to data
   var u = svg.selectAll("path")
      .data(data_ready)
      .on("mouseover", function(d){tooltip.text(d.data.key + ": " + d.data.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " "); return tooltip.style("visibility", "visible");})
      .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

   // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
   u
      .enter()
      .append('path')
      .merge(u)
      .transition()
      .duration(1000)
      .attr('d', d3.arc()
         .innerRadius(1)
         .outerRadius(radius)
      )
      .attr('fill', function(d){ return(color(d.data.key)) })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 1)
      

   // remove the group that is not present anymore
   u
      .exit()
      .remove()

}

d3.csv("map/presidential_results.csv", function (error, data) {
   if (error) {
       throw error;
   }
   
   let districts = new Array();
   data.forEach(function(d) {
      districts.push(d.district);
   });

   // add the options to the button
   d3.select("#selectButton")
      .selectAll('myOptions')
      .data(districts)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // When the button is changed, run the updateChart function
   d3.select("#selectButton").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value");

      // create 2 data_set
      d3.csv("map/presidential_results.csv", function (error, data) {
         if (error) {
            throw error;
         }
         var new_data = data.filter(function(f){ return f.district === selectedOption; })[0];
   
         registered_voters = +new_data.registered_voters;
         invalid_votes = +new_data.invalid_votes;
         valid_votes = +new_data.valid_votes;
      
         var turn_up = (invalid_votes + valid_votes);
         var no_show = (registered_voters);
         
         var data = {
            //registered_voters : registered_voters,
            "Voted" : turn_up,
            "Registered" : no_show,
         }

         // Initialize the plot with the first dataset
         update(data)

      });
   })

});


// create default data_set
d3.csv("map/presidential_results.csv", function (error, data) {
   if (error) {
       throw error;
   }
   var new_data = data.filter(function(f){ return f.district == "KAMPALA"; })[0];
   
   registered_voters = +new_data.registered_voters;
   invalid_votes = +new_data.invalid_votes;
   valid_votes = +new_data.valid_votes;

   var turn_up = (invalid_votes + valid_votes);
   var no_show = (registered_voters);
   
   var data = {
      //registered_voters : registered_voters,
      "Voted" : turn_up,
      "Registered" : no_show,

      /*
      kabuleta: new_data['kabuleta'],
      kalembe: new_data['kalembe'],
      katumba: new_data['katumba'],
      kyagulanyi: new_data['kyagulanyi'],
      mao: new_data['mao'],
      mayambala: new_data['mayambala'],
      muntu: new_data['muntu'],
      museveni: new_data['museveni'],
      mwesigye: new_data['mwesigye'],
      amuriat: new_data['amuriat'],
      tumukunde: new_data['tumukunde']*/
   }

   // Initialize the plot with the first dataset
   update(data)

});


