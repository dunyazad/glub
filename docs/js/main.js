$.ajaxSetup({ async: false });
const rawMain = $.get('data/main.cpp').responseText;
$.ajaxSetup({ async: true });

function getMain() {
    let includes = '', windowClass = '', init = '';

    for (let lib of Object.keys(data)) {
        if (data[lib]['selected']) {
            if (data[lib]['include']) {
                includes += `${data[lib]['include']}\n`;
            }

            if (data[lib]['init']) {
                init += `\nstd::cout << "Initializing ${lib}..." << std::flush;\n${data[lib]['init']}\nstd::cout << "OK" << std::endl;\n`;
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
        .replaceAll('/*window*/', windowClass);
}
