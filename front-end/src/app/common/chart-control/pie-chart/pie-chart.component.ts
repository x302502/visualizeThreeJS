import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IPieChart } from './pie-chart.model';
import * as $ from 'jquery';
import * as d3 from 'd3';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  @ViewChild('chart') chartRef: ElementRef;
  collapsed: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  draw(pieChart: IPieChart) {
    $(this.chartRef.nativeElement).width(pieChart.width);
    $(this.chartRef.nativeElement).height(pieChart.height);

    let outerRadius = Math.min(pieChart.width, pieChart.height) / 2,
      innerRadius = outerRadius * .999,
      // for animation
      innerRadiusFinal = outerRadius * .5,
      innerRadiusFinal3 = outerRadius * .45,
      color = d3.scaleOrdinal(d3.schemeCategory10);    //builtin range of colors

    var vis = d3.select(this.chartRef.nativeElement)
      .append("svg:svg")              //create the SVG element inside the <body>
      .data([pieChart.items])                   //associate our data with the document
      .attr("width", pieChart.width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
      .attr("height", pieChart.height)
      .append("svg:g")                //make a group to hold our pie chart
      .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");   //move the center of the pie chart from 0, 0 to radius, radius

    let arc = d3.arc()            //this will create <path> elements for us using arc data
      .outerRadius(outerRadius).innerRadius(innerRadius);

    // for animation
    let arcFinal = d3.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
    let arcFinal3 = d3.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

    let pie = d3.pie()          //this will create arc data for us given a list of values
      .value((d: any) => d.value);    //we must tell it out to access the value of each element in our data array

    let arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
      .data(pie as any)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
      .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
      .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
      .attr("class", "slice")    //allow us to style things in the slices (like text)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", click);

    arcs.append("svg:path")
      .attr("fill", (pie: any) => pie.data.color) //set the color for each slice to be chosen from the color function defined above
      .attr("d", arc)     //this creates the actual SVG path using the associated data (pie) with the arc drawing function
      .append("svg:title") //mouseover title showing the figures
      .text((pie: any) => pie.data.title + ": " + pie.data.value);

    d3.selectAll("g.slice").selectAll("path").transition()
      .duration(750)
      .delay(10)
      .attr("d", arcFinal);

    // Add a label to the larger arcs, translated to the arc centroid and rotated.
    // source: http://bl.ocks.org/1305337#index.html
    arcs.filter(function (d: any) { return d.endAngle - d.startAngle > .2; })
      .append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("transform", function (d: any) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })
      //.text(function(d) { return formatAsPercentage(d.value); })
      .text((d: any) => d.data.value );

    // Computes the label angle of an arc, converting from radians to degrees.
    function angle(d) {
      var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
      return a > 90 ? a - 180 : a;
    }


    // Pie chart title			
    vis.append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(pieChart.title)
      .attr("class", "title")
      ;



    function mouseover() {
      d3.select(this).select("path").style('cursor', 'pointer');
      d3.select(this).select("path").transition()
        .duration(750)
        //.attr("stroke","red")
        //.attr("stroke-width", 1.5)
        .attr("d", arcFinal3)
        ;
    }

    function mouseout() {
      d3.select(this).select("path").style('cursor', 'none');
      d3.select(this).select("path").transition()
        .duration(750)
        //.attr("stroke","blue")
        //.attr("stroke-width", 1.5)
        .attr("d", arcFinal)
        ;
    }

    function click(d, i) {

      if (pieChart.click) {
        pieChart.click(d.data);
      }
    }
  }
}
