site.scatter = (() => {
    const createScatter = data => {
        const height = 1000;
        const width = 1000;
        const margin = { top: 50, left: 50, right: 50, bottom: 50 };

        const svg = d3.select('#scatter')
            .append('svg')
            .attr('height', height)
            .attr('width', width);

        const MAX_LIFE_EXP = d3.max(data, d => d.life_exp);
        const MAX_GDP_CAP = d3.max(data, d => d.gdp_cap);

        const y = d3.scaleLinear()
            .domain([0, MAX_LIFE_EXP])
            .range([height - margin.bottom, margin.top])

        const x = d3.scaleLinear()
            .domain([0, MAX_GDP_CAP])
            .range([margin.left, width - margin.right])

        svg
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('r', d => d.population / (10 ** 6) / 5)
            .attr('cy', d => y(d.life_exp))
            .attr('cx', d => x(d.gdp_cap))
            .attr('fill', 'royalblue')
            .attr('opacity', '0.5');

        svg
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .text(d => d.country)
            .attr('y', d => y(d.life_exp))
            .attr('x', d => x(d.gdp_cap))
            .attr('font-size', '11px')
            .attr('fill', 'red');

        svg.node();
    }

    const init = y => {
        document.getElementById('scatter').innerHTML = '';
        site.utils.getData(y)
            .then(createScatter);
    }

    return {
        init
    }
})();