site = {};

site.utils = (() => {
    const extractByCountry = (data, country) => {
        const filtered = data.filter(each => each.LOCATION === country)

        return filtered.map(each => each.Value);
    }

    return {
        extractByCountry
    }
})();

site.init = (() => {
    const createBarChart = data => {
        const extractedData = site.utils.extractByCountry(data, 'AUS');

        d3.select('#barChart')
            .data(extractedData)
            .enter()
            .append('div')
            .attr('class', 'bar')
            .attr('fill', function (d) {
                return 'rgb(0, 0, ' + (d * 10) + ')';
            })
            .style('height', function (d) {
                var barHeight = d / 10;
                return barHeight + 'px';
            });
    }

    d3.csv('https://query.data.world/s/pxpwb3vilicloyddbcrbkpwicoucui')
        .then(createBarChart);

})();
