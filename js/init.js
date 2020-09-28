function init() {
    $('#result').on('click', () => {
        copyToClipboard(getCmake());
        toast("CMakeLists.txt contents copied to clipboard");
        save();
    });

    $('#main').on('click', () => {
        copyToClipboard(getMain());
        toast("main.cpp contents copied to clipboard");
        save();
    });

    $('#main').on('mouseover', () => {
        $('#main-tooltip').css({ display: 'block' });
    });

    $('#main').on('mouseout', () => {
        $('#main-tooltip').css({ display: 'none' });
    });

    $('#gh-link').on('mouseover', () => {
        $('#gh-tooltip').css({ display: 'block' });
    });

    $('#gh-link').on('mouseout', () => {
        $('#gh-tooltip').css({ display: 'none' });
    });

    $('#project-name').on('input', () => {
        projectInfo.name = $('#project-name').val().replace(' ', '-').replace(';', '');
        $('#project-name').val(projectInfo.name);
        updateCmake();
    });
    $('#project-name').attr('placeholder', DEFAULT_NAME);

    $('#project-version').on('input', () => {
        projectInfo.version = $('#project-version').val().replace(';', '');
        $('#project-version').val(projectInfo.version);
        updateCmake();
    });
    $('#project-version').attr('placeholder', DEFAULT_VERSION);

    $('#project-description').on('input', () => {
        projectInfo.description = $('#project-description').val().replace(';', '');
        $('#project-description').val(projectInfo.description);
        updateCmake();
    });
    $('#project-description').attr('placeholder', DEFAULT_DESCRIPTION);

    function toggleLib(lib) {
        data[lib]['selected'] = !data[lib]['selected'];
        $(`#${lib}`).toggleClass('selected');
    }

    function selectLib(lib) {
        data[lib]['selected'] = true;
        $(`#${lib}`).addClass('selected');
    }

    function deselectLib(lib) {
        data[lib]['selected'] = false;
        $(`#${lib}`).removeClass('selected');
    }

    for (let lib of Object.keys(data)) {
        $(`*[data-category="${data[lib]['category']}"]`).append(`<button id="${lib}" class="option${data[lib]['selected'] ? ' selected' : ''}">${lib}</button>`);

        if (data[lib]['require']) {
            for (let requires of data[lib]['require']) {
                for (let req of requires.split("|")) {
                    if (!data[req]['dependency']) {
                        data[req]['dependency'] = [];
                    }

                    data[req]['dependency'].push(lib);
                }
            }
        }

        $(`#${lib}`).on('click', () => {
            toggleLib(lib);

            if (data[lib]['incompatible']) {
                for (let incompatible of data[lib]['incompatible']) {
                    deselectLib(incompatible);
                }
            }

            if (data[lib]['require']) {
                for (let requires of data[lib]['require']) {
                    let reqList = requires.split("|");
                    let oneSelected = false;

                    for (let req of reqList) {
                        if (data[req]['selected']) {
                            oneSelected = true;
                            break;
                        }
                    }

                    if (!oneSelected) {
                        selectLib(reqList[0]);
                    }
                }
            }

            if (data[lib]['dependency']) {
                for (let dependency of data[lib]['dependency']) {
                    for (let requires of data[dependency]['require']) {
                        if (requires.includes(lib)) {

                            let reqList = requires.split("|");
                            let oneSelected = false;

                            for (let req of reqList) {
                                if (data[req]['selected']) {
                                    oneSelected = true;
                                    break;
                                }
                            }

                            if (!oneSelected) {
                                deselectLib(dependency);
                            }
                        }
                    }
                }
            }

            if (data[lib]['customWindow']) {
                for (let tmp of Object.keys(data)) {
                    if (data[tmp]['customWindow'] && data[tmp]['selected'] && tmp !== lib) {
                        deselectLib(tmp);
                    }
                }
            }

            updateCmake();
        });
    }

    $('.cmake-card').css('min-height', $('.setting-cards').height());

    updateCmake();
}
