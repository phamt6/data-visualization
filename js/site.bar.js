site.bar = (() => {
    let year = null;
    let country = null;

    const createBarChart = data => {
        const height = 500;
        const width = 2000;
        const margin = { top: 50, left: 50, right: 50, bottom: 50 };

        const xAxis = g => g
            .attr('transform', `translate(7, ${height})`)
            .attr('font-size', '20px')
            .call(
                d3.axisBottom(x)
                    .tickSize(0)
                    .tickFormat(i => data[i].country)
            );

        const svg = d3.select('#barChart')
            .append('svg')
            .attr('height', height + margin.bottom)
            .attr('width', width);

        const x = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height - margin.bottom, margin.top])

        svg
            .append('g')
            .attr('fill', 'royalblue')
            .selectAll('rect')
            .data(data.sort((a, b) => d3.descending(a.life_exp, b.life_exp)))
            .join('rect')
            .attr('x', (d, i) => x(i))
            .attr('y', d => y(d.life_exp))
            .attr('height', d => y(0) - y(d.life_exp))
            .attr('width', x.bandwidth())

        svg.node();

        svg
            .append('g')
            .call(xAxis)
            .selectAll('text')
            .attr('class', 'bar_label');
    };

    const init = y => {
        year = y;
        document.getElementById('barChart').innerHTML = '';

        site.utils.getData(y)
            .then(createBarChart);
    }

    return {
        init
    }
})();