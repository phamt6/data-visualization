site = {};

site.utils = (() => {
    let data = null;

    const extractByCountry = (data, country, year = 2017) => {
        const filtered = country ?
            data.filter(each => each.LOCATION === country && each.TIME == year) :
            data.filter(each => each.TIME == year)

        return filtered.map(each => {
            return {
                country: each.LOCATION,
                value: Number(each.Value) * 100000
            }
        });
    }

    const getData = () => {
        if (data) { return Promise.resolve(data); }
        else {
            return d3.csv('https://phamt6.github.io/data/finland_income.csv')
                .then(d => {
                    data = d;
                    return data;
                });
        }
    }

    return {
        extractByCountry,
        getData
    }
})();

site.bar = (() => {
    let year = null;
    let country = null;

    const createBarChart = data => {
        const extractedData = site.utils.extractByCountry(data, country, year);

        const height = 500;
        const width = 1000;
        const margin = { top: 50, left: 50, right: 50, bottom: 50 };

        const xAxis = g => g
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .attr('font-size', '20px')
            .call(d3.axisBottom(x).tickFormat(i => extractedData[i].country))

        const svg = d3.select('#barChart')
            .append('svg')
            .attr('height', height)
            .attr('width', width);

        const x = d3.scaleBand()
            .domain(d3.range(extractedData.length))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, 100000])
            .range([height - margin.bottom, margin.top])

        svg
            .append('g')
            .attr('fill', 'royalblue')
            .selectAll('rect')
            .data(extractedData.sort((a, b) => d3.descending(a.value, b.value)))
            .join('rect')
            .attr('x', (d, i) => x(i))
            .attr('y', d => y(d.value))
            .attr('height', d => y(0) - y(d.value))
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
        const extractedData = site.utils.extractByCountry(data);

        const height = 500;
        const width = 1000;
        const margin = { top: 50, left: 50, right: 50, bottom: 50 };

        const svg = d3.select('#scatter')
            .append('svg')
            .attr('height', height)
            .attr('width', width);

        svg
            .selectAll('circle')
            .data(extractedData)
            .append('circle')
            .attr('r', 15)
            .attr('cx', d => d.value)
            .attr('class', 'scatter_circle');

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

document.getElementById('slider_year').addEventListener('change', e => {
    site.bar.init(e.target.value);
})


