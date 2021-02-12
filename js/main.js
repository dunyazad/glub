function getMain(rawMain, name, data, readFile) {
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
                windowClass = readFile(`data/${lib}Window.cpp`);
            }
        }
    }

    if (windowClass === '') {
        windowClass = `#ifdef UNIX\n${readFile('data/XLibWindow.cpp')}#endif\n\n#ifdef WINDOWS\n${readFile('data/WinAPIWindow.cpp')}#endif\n\n`;
    }

    return rawMain.replace(/\/\*name\*\//g, name)
        .replace(/\/\*includeLibs\*\//g, includes)
        .replace(/\/\*init\*\//g, init)
        .replace(/\/\*update\*\//g, update)
        .replace(/\/\*window\*\//g, windowClass);
}

try {
    module.exports = { getMain };
} catch (e) {}
