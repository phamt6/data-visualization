site.init = (() => {
    document.addEventListener('change', e => {
        const selectedYear = Number(e.target.value);
        site.bar.init(selectedYear);
        site.scatter.init(selectedYear);
    });

    document.getElementById('animate-btn').addEventListener('click', site.utils.startAutomation);
    document.getElementById('stop-btn').addEventListener('click', site.utils.stopAutomation);

    site.bar.init();
    site.scatter.init();
    site.map.init();
})();



