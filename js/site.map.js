site.map = (() => {
    const height = 800;
    const width = 1000;
    // const margin = { top: 50, left: 50, right: 50, bottom: 50 };

    const svg = d3.select('#mapChart')
        .append('svg')
        .attr('height', height)
        .attr('width', width);

    const projection = d3.geoMercator()
        .center([0, 20])
        .scale(99)
        .translate([width / 2, height / 2]);

    const generateBubbleMap = resp => {
        const dataGeo = resp[0];
        const data = resp[1];

        // Create a color scale
        var allContinent = d3.map(data, d => d.homecontinent).keys()
        var color = d3.scaleOrdinal()
            .domain(allContinent)
            .range(d3.schemePaired);

        // Add a scale for bubble size
        var valueExtent = d3.extent(data, d => +d.n)
        var size = d3.scaleSqrt()
            .domain(valueExtent)  // What's in the data
            .range([1, 50])  // Size in pixel

        // Draw the map
        svg.append('g')
            .selectAll('path')
            .data(dataGeo.features)
            .enter()
            .append('path')
            .attr('fill', '#b8b8b8')
            .attr('d', d3.geoPath()
                .projection(projection)
            )
            .style('stroke', 'none')
            .style('opacity', .3)

        // Add circles:
        svg
            .selectAll('myCircles')
            .data(data.sort(function (a, b) { return +b.n - +a.n }).filter(function (d, i) { return i < 1000 }))
            .enter()
            .append('circle')
            .attr('cx', function (d) { return projection([+d.homelon, +d.homelat])[0] })
            .attr('cy', function (d) { return projection([+d.homelon, +d.homelat])[1] })
            .attr('r', function (d) { return size(+d.n) })
            .style('fill', function (d) { return color(d.homecontinent) })
            .attr('stroke', function (d) { if (d.n > 2000) { return 'black' } else { return 'none' } })
            .attr('stroke-width', 1)
            .attr('fill-opacity', .4)



        // Add title and explanation
        svg
            .append('text')
            .attr('text-anchor', 'end')
            .style('fill', 'black')
            .attr('x', width - 10)
            .attr('y', height - 30)
            .attr('width', 90)
            .html('WHERE SURFERS LIVE')
            .style('font-size', 14)

        svg.node();
        // --------------- //
        // ADD LEGEND //
        // --------------- //

        // Add legend: circles
        var valuesToShow = [100, 4000, 15000]
        var xCircle = 40
        var xLabel = 90
        svg
            .selectAll('legend')
            .data(valuesToShow)
            .enter()
            .append('circle')
            .attr('cx', xCircle)
            .attr('cy', function (d) { return height - size(d) })
            .attr('r', function (d) { return size(d) })
            .style('fill', 'none')
            .attr('stroke', 'black')

        // Add legend: segments
        svg
            .selectAll('legend')
            .data(valuesToShow)
            .enter()
            .append('line')
            .attr('x1', function (d) { return xCircle + size(d) })
            .attr('x2', xLabel)
            .attr('y1', function (d) { return height - size(d) })
            .attr('y2', function (d) { return height - size(d) })
            .attr('stroke', 'black')
            .style('stroke-dasharray', ('2,2'))

        // Add legend: labels
        svg
            .selectAll('legend')
            .data(valuesToShow)
            .enter()
            .append('text')
            .attr('x', xLabel)
            .attr('y', function (d) { return height - size(d) })
            .text(function (d) { return d })
            .style('font-size', 10)
            .attr('alignment-baseline', 'middle')
    }

    const init = () => {
        // document.getElementById('mapChart').innerHTML = '';
        const promises = [];

        promises.push(d3.json('https://phamt6.github.io/data/world.geojson'));
        promises.push(d3.csv('https://phamt6.github.io/data/gps_bubble.csv'));

        Promise.all(promises)
            .then(generateBubbleMap)
            .catch(err => console.log(err));
    }

    return {
        init
    }
})();