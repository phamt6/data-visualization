site = {};

site.utils = (() => {
    let data = null;

    const getData = () => {
        if (data) { return Promise.resolve(data); }
        else {
            return d3.csv('https://phamt6.github.io/data/gapminder.csv')
                .then(d => {
                    data = d;
                    return data;
                });
        }
    }

    return {
        getData
    }
})();

site.bar = (() => {
    let year = null;
    let country = null;

    const createBarChart = data => {
        const height = 500;
        const width = 2000;
        const margin = { top: 50, left: 50, right: 50, bottom: 50 };

        const xAxis = g => g
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .attr('class', 'rotate')
            .attr('font-size', '20px')
            .call(d3.axisBottom(x).tickFormat(i => data[i].country))

        const svg = d3.select('#barChart')
            .append('svg')
            .attr('height', height)
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
        svg.append('g').call(xAxis);

    };

    const init = y => {
        year = y;
        document.getElementById('barChart').innerHTML = '';

        site.utils.getData()
            .then(createBarChart);
    }

    return {
        init
    }
})();

site.scatter = (() => {
    const createScatter = data => {
        const height = 2000;
        const width = 2000;
        const margin = { top: 50, left: 50, right: 50, bottom: 50 };

        const svg = d3.select('#scatter')
            .append('svg')
            .attr('height', height)
            .attr('width', width);

        svg
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('r', d => d.population / (10 ** 6) / 10)
            .attr('cy', d => d.life_exp * 10)
            .attr('cx', d => d.gdp_cap / 30)
            .attr('fill', 'royalblue')
            .attr('opacity', '0.5');

        svg
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .text(d => d.country)
            .attr('y', d => d.life_exp * 10)
            .attr('x', d => d.gdp_cap / 30)
            .attr('font-size', '11px')
            .attr('fill', 'red');

        svg.node();
    }

    const init = () => {
        site.utils.getData()
            .then(createScatter);
    }

    return {
        init
    }
})();

site.bar.init();
site.scatter.init();


