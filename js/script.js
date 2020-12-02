site = {};

site.utils = (() => {
    let data = null;
    let extractedData = {};
    let timer = null;
    let yearBtn = null;

    const _getFromYear = year => {
        if (extractedData[year].length === 0) {
            extractedData[year] = data.filter(d => Number(d.year) === year)
        }

        return extractedData[year];
    }

    const _createSelector = y => {
        const el = document.createElement('span');
        el.innerHTML = `
            <input type="radio" id="year_${y}" name="year" value="${y}">
            <label for="${y}">${y}</label>
        `;
        return el;
    }

    const _recordYear = () => {
        data.forEach(d => {
            if (!extractedData[d.year]) {
                extractedData[d.year] = [];
                document.getElementById('year_selector').appendChild(_createSelector(d.year));
            }
        })

        document.querySelector('[name="year"]').checked = 'checked';
    }

    const _getNextYear = () => {
        const _years = Object.keys(extractedData);
        const _currentYear = document.querySelector('input[type="radio"]:checked').value;
        const _currentYearIndex = _years.indexOf(_currentYear);
        const _nextYearIndex = _currentYearIndex === (_years.length - 1) ? 0 : _currentYearIndex + 1;
        return _years[_nextYearIndex];
    }

    const startAutomation = () => {
        timer = setInterval(() => {
            document.querySelector(`#year_${_getNextYear()}`).click();
        }, 1000);
    }

    const stopAutomation = () => {
        clearInterval(timer);
    }

    const getData = (year = 1952) => {
        if (data) { return Promise.resolve(_getFromYear(year)); }
        else {
            return d3.csv('https://phamt6.github.io/data/gapminder_full.csv')
                .then(d => {
                    data = d;
                    _recordYear();
                    return _getFromYear(year);
                });
        }
    }

    return {
        getData,
        startAutomation,
        stopAutomation
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

document.addEventListener('change', e => {
    const selectedYear = Number(e.target.value);
    // site.bar.init(selectedYear);
    site.scatter.init(selectedYear);
});

document.getElementById('animate-btn').addEventListener('click', site.utils.startAutomation);
document.getElementById('stop-btn').addEventListener('click', site.utils.stopAutomation);

// site.bar.init();
site.scatter.init();



