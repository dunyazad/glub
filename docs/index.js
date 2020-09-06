if (rawData) {
    data = JSON.parse(rawData);
    $(document).ready(() => {
        init();
    });
} else {
    $.getJSON('data/libraries.json', (parsed) => {
        data = parsed;
        $(document).ready(() => {
            init();
        });
    });
}
