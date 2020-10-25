$.getJSON('data/libraries.json', (parsed) => {
    data = parsed;
    $(document).ready(() => {
        init();
    });
});
