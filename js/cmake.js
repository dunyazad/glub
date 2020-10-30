$.ajaxSetup({ async: false });
const rawCmake = $.get('data/CMakeLists.txt').responseText;
const rawSubmodulesUpdate = $.get('data/SubmodulesUpdate.txt').responseText;
$.ajaxSetup({ async: true });

function cmakeToHtml(cmake) {
    let html = "", intend = 0, vars = [ "GIT_FOUND", "IMGUI_FILES", "SRC_FILES", "RUNTIME_OUTPUT_DIRECTORY" ];

    for (let lib of Object.keys(data)) {
        vars.push(`LIB_${lib}`);
    }

    for (let line of cmake.split('\n')) {
        line = $.trim(line);

        if (line === '') {
            html += '<br>';
        } else {
            let command = line.match(/^[a-zA-Z_]+(?=\(.*\)$)/m)[0];

            if (command.startsWith('end')) {
                intend--;
            }

            html += `<div style="margin-left: ${(command.startsWith('else') ? intend - 1 : intend) * 20}px">`;

            html += `${command}(`;
            line = line.replace(/^[a-zA-Z_]+\((?=.*\)$)/m, '');

            let resVar = line.match(/(?<=RESULT_VARIABLE )[a-zA-Z0-9_]+/);

            if (resVar) {
                vars.push(resVar[0]);
            }

            for (let variable of vars) {
                line = line.replaceAll(variable, `</span><span class="yellow">${variable}</span><span class="green">`);
            }

            for (let match of line.matchAll(/(?<=\${)[a-zA-Z0-9_]+(?=})/gm)) {
                line = line.replace(`\${${match}}`, `</span>\${<span class="yellow">${match}</span>}<span class="green">`);
            }

            for (let keyword of cmakeKeywords) {
                line = line.replaceAll(keyword, `<span class="blue">${keyword}</span>`);
            }

            line = line.replaceAll(')', '</span>)<span class="green">')
                .replaceAll(';', '</span>;<span class="green">');

            if (command === 'if' || command === 'foreach') {
                intend++;
            }

            if (command === 'set' && (line.match(/^[a-zA-Z0-9_]+(?=[ <])/m))) {
                let newVar = line.match(/^[a-zA-Z0-9_]+(?=[ <])/m)[0];
                line = line.replace(/^[a-zA-Z0-9_]+/m, '');
                vars.push(newVar);
                html += `<span class="yellow">${newVar}</span>`;

                html += `<span class="green">${line}</span>`;
            } else if (command === 'add_compile_definitions') {
                let newDef = line.match(/^[a-zA-Z0-9_]+/m);

                if (newDef) {
                    line = line.replace(/^[a-zA-Z0-9_]+/m, '');
                    html += `<span class="yellow">${newDef[0]}</span>`;

                    html += `<span class="green">${line}</span>`;
                } else {
                    html += line;
                }
            } else if (command === 'foreach') {
                let newVar = line.match(/^[a-zA-Z0-9_]+/m)[0];
                line = line.replace(/^[a-zA-Z0-9_]+/m, '');
                vars.push(newVar);
                html += `<span class="yellow">${newVar}</span>`;

                html += `<span class="green">${line}</span>`;
            } else {
                html += `<span class="green">${line}</span>`;
            }

            html += `</div>`;
        }
    }

    return html;
}

function getCmake() {
    let selected = [], libPaths = '', libRepos = '', setup = '', linkLibs = '', usedLibs = '', libMacros = '', hasWindowLib = false, compileOptions = '', execFiles = `\${SRC_FILES}`, submodulesUpdate='', addTarget = '';

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

        if (data[lib]['linkLib']) {
            if (data[lib]['linkLib'].trim() !== '') {
                linkLibs += `${data[lib]['linkLib']}\n`;
            }
        } else {
            linkLibs += `target_link_libraries(${projectInfo.name || DEFAULT_NAME} ${lib.toLowerCase()})\n`;
        }
        usedLibs += `\nset(LIB_${lib} ON)`;
        libMacros += `\nadd_compile_definitions(LIB_${lib.toUpperCase()})`;

        if (data[lib]['customWindow']) {
            hasWindowLib = true;
        }

        if (data[lib]['compileOptions']) {
            compileOptions += ` ${data[lib]['compileOptions']}`;
        }

        if (data[lib]['execFiles']) {
            execFiles += ` \${${data[lib]['execFiles']}}`
        }
    }

    if (libPaths !== '') {
        submodulesUpdate = rawSubmodulesUpdate;
    }

    if (!hasWindowLib) {
        linkLibs += `target_link_libraries(${projectInfo.name || DEFAULT_NAME} X11)\n`;
    }

    if (projectInfo.isLibrary) {
        addTarget = `add_library(${projectInfo.name || DEFAULT_NAME} SHARED ${execFiles})`;
    } else {
        addTarget = `add_executable(${projectInfo.name || DEFAULT_NAME} ${execFiles})`;
    }

    return rawCmake.replaceAll('#[[submodulesUpdate]]', submodulesUpdate)
        .replaceAll('#[[addTarget]]', addTarget)
        .replaceAll('#[[libPaths]]', libPaths)
        .replaceAll('#[[libRepos]]', libRepos)
        .replaceAll('#[[setup]]', setup)
        .replaceAll('#[[linkLibs]]', linkLibs)
        .replaceAll('#[[usedLibs]]', usedLibs)
        .replaceAll('#[[libMacros]]', libMacros)
        .replaceAll('#[[compileOptions]]', compileOptions)
        .replaceAll('#[[execFiles]]', execFiles)
        .replaceAll('#[[name]]', projectInfo.name || DEFAULT_NAME)
        .replaceAll('#[[version]]', projectInfo.version || DEFAULT_VERSION)
        .replaceAll('#[[description]]', projectInfo.description || DEFAULT_DESCRIPTION)
        .replaceAll('#[[srcPath]]', projectInfo.srcPath || DEFAULT_SRC_PATH)
        .replaceAll('#[[resPath]]', projectInfo.resPath || DEFAULT_RES_PATH);
}

function updateCmake() {
    $('#result').html(cmakeToHtml(getCmake()));
}
