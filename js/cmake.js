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

function getCmake(libraries, name, version, description, srcPath, resPath, isLibrary, useHttps, data, rawCmake, rawSubmodulesUpdate) {
    let libPaths = '', libRepos = '', setup = '', linkLibs = '', usedLibs = '', libMacros = '', hasWindowLib = false, unixCompileOptions = '', winCompileOptions = '', execFiles = `\${SRC_FILES}`, submodulesUpdate='', addTarget = '';

    for (let lib of libraries) {
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
            linkLibs += `target_link_libraries(${name} ${lib.toLowerCase()})\n`;
        }
        usedLibs += `\nset(LIB_${lib} ON)`;
        libMacros += `\nadd_compile_definitions(LIB_${lib.toUpperCase()})`;

        if (data[lib]['customWindow']) {
            hasWindowLib = true;
        }

        if (data[lib]['unixCompileOptions']) {
            unixCompileOptions += ` ${data[lib]['unixCompileOptions']}`;
        }

        if (data[lib]['winCompileOptions']) {
            winCompileOptions += ` ${data[lib]['winCompileOptions']}`;
        }

        if (data[lib]['execFiles']) {
            execFiles += ` \${${data[lib]['execFiles']}}`
        }
    }

    if (libPaths !== '') {
        submodulesUpdate = rawSubmodulesUpdate;
    }

    if (!hasWindowLib) {
        linkLibs += `target_link_libraries(${name} X11)\n`;
    }

    if (isLibrary) {
        addTarget = `add_library(${name} SHARED ${execFiles})`;
    } else {
        addTarget = `add_executable(${name} ${execFiles})`;
    }

    return rawCmake.replace(/#\[\[submodulesUpdate]]/g, submodulesUpdate)
        .replace(/#\[\[addTarget]]/g, addTarget)
        .replace(/#\[\[libPaths]]/g, libPaths)
        .replace(/#\[\[libRepos]]/g, libRepos)
        .replace(/#\[\[setup]]/g, setup)
        .replace(/#\[\[linkLibs]]/g, linkLibs)
        .replace(/#\[\[usedLibs]]/g, usedLibs)
        .replace(/#\[\[libMacros]]/g, libMacros)
        .replace(/#\[\[unixCompileOptions]]/g, unixCompileOptions)
        .replace(/#\[\[winCompileOptions]]/g, winCompileOptions)
        .replace(/#\[\[execFiles]]/g, execFiles)
        .replace(/#\[\[name]]/g, name)
        .replace(/#\[\[version]]/g, version)
        .replace(/#\[\[description]]/g, description)
        .replace(/#\[\[srcPath]]/g, srcPath)
        .replace(/#\[\[resPath]]/g, resPath);
}

function updateCmake() {
    $('#result').html(cmakeToHtml(getCmake(getSelectedLibraries(),
        projectInfo.name || DEFAULT_NAME,
        projectInfo.version || DEFAULT_VERSION,
        projectInfo.description || DEFAULT_DESCRIPTION,
        projectInfo.srcPath || DEFAULT_SRC_PATH,
        projectInfo.resPath || DEFAULT_RES_PATH,
        projectInfo.isLibrary,
        useHttps,
        data,
        rawCmake,
        rawSubmodulesUpdate
    )));
}

try {
    module.exports = {getCmake};
} catch (e) {}
