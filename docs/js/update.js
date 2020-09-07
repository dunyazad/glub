$.ajaxSetup({ async: false });
const rawCmake = $.get('data/cmake.txt').responseText;
$.ajaxSetup({ async: true });

function getCmake() {
    let selected = [], libPaths = '', libRepos = '', setup = '', linkLibs = '', usedLibs = '';

    $('.settings-container .selected').each((item, element) => {
        selected.push($(element).attr('id'));
    });

    for (let lib of selected) {
        let urlFound = true;

        if (useHttps) {
            if (data[lib]['https']) {
                libRepos += `${data[lib]['https']};`;
            } else {
                if (data[lib]['ssh']) {
                    libRepos += `${data[lib]['ssh']};`;
                    console.warn(`HTTPS for ${lib} repository not found!`);
                } else {
                    console.error(`No URL for ${lib} repository not found!`);
                    urlFound = false;
                }
            }
        } else {
            if (data[lib]['ssh']) {
                libRepos += `${data[lib]['ssh']};`;
            } else {
                if (data[lib]['https']) {
                    libRepos += `${data[lib]['https']};`;
                    console.warn(`SSH for ${lib} repository not found!`);
                } else {
                    console.error(`No URL for ${lib} repository not found!`);
                    urlFound = false;
                }
            }
        }

        if (urlFound) {
            libPaths += `lib/${lib.toLowerCase()};`;
        }

        if (data[lib]['setup']) {
            setup += `\nmessage(STATUS "Setting up ${lib}...")\n${data[lib]['setup']}\n`;
        }

        linkLibs += `target_link_libraries(${projectInfo.name || DEFAULT_NAME} ${lib.toLowerCase()})\n`;
        usedLibs += `\nset(LIB_${lib} ON)`;
    }

    return rawCmake.replaceAll('#[[name]]', projectInfo.name || DEFAULT_NAME)
        .replaceAll('#[[version]]', projectInfo.version || DEFAULT_VERSION)
        .replaceAll('#[[description]]', projectInfo.description || DEFAULT_DESCRIPTION)
        .replaceAll('#[[libPaths]]', libPaths)
        .replaceAll('#[[libRepos]]', libRepos)
        .replaceAll('#[[setup]]', setup)
        .replaceAll('#[[linkLibs]]', linkLibs)
        .replaceAll('#[[usedLibs]]', usedLibs);
}

function update() {
    $('#result').html(cmakeToHtml(getCmake()));
}
