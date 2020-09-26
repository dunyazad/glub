$.ajaxSetup({ async: false });
const rawMain = $.get('data/main.cpp').responseText;
$.ajaxSetup({ async: true });

function getMain() {
    let includes = '', windowClass = '', init = '', update = '';

    for (let lib of Object.keys(data)) {
        if (data[lib]['selected']) {
            if (data[lib]['include']) {
                includes += `${data[lib]['include']}\n`;
            }

            if (data[lib]['init']) {
                init += `\n\tstd::cout << "Initializing ${lib}..." << std::flush;\n${data[lib]['init']}\n\n\tstd::cout << "OK" << std::endl;`;
            }

            if (data[lib]['update']) {
                update += data[lib]['update'];
            }

            if (data[lib]['customWindow']) {
                $.ajaxSetup({ async: false });
                windowClass = $.get(`data/${lib}Window.cpp`).responseText;
                $.ajaxSetup({ async: true });
            }
        }
    }

    if (windowClass === '') {
        $.ajaxSetup({ async: false });
        windowClass = $.get(`data/XLibWindow.cpp`).responseText;
        $.ajaxSetup({ async: true });
    }

    return rawMain.replaceAll('/*name*/', projectInfo.name || DEFAULT_NAME)
        .replaceAll('/*includeLibs*/', includes)
        .replaceAll('/*init*/', init)
        .replaceAll('/*update*/', update)
        .replaceAll('/*window*/', windowClass);
}
