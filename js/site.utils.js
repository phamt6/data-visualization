site = {};

site.utils = (() => {
    const DATA_URL = 'https://phamt6.github.io/data/gapminder_full.csv';
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
        if (timer) return;

        timer = setInterval(() => {
            document.querySelector(`#year_${_getNextYear()}`).click();
        }, 1000);
    }

    const stopAutomation = () => {
        clearInterval(timer);
        timer = null;
    }

    const getData = (year = 1952) => {
        if (data) { return Promise.resolve(_getFromYear(year)); }
        else {
            return d3.csv(DATA_URL)
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