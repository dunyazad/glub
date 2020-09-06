function copyToClipboard(str) {
    let $temp = $("<textarea style='opacity: 0'>");
    $("body").append($temp);
    $temp.val(str).select();
    document.execCommand("copy");
    $temp.remove();
}

function toast(str) {
    let $toast = $(`<div class=\"toast\">${str}</div>`);
    $("body").append($toast);
    $toast.animate({ right: "20px" }, 180, "swing", () => {
        $toast.animate({ opacity: 0 }, 2500, "swing", () => {
            $toast.remove();
        });
    });
}

function save() {
    localStorage.setItem('libData', JSON.stringify(data));

    if (projectInfo.name && projectInfo.version && projectInfo.description) {
        localStorage.setItem('projectInfo', JSON.stringify(projectInfo));
    }
}

function cmakeToHtml(cmake) {
    let html = "", intend = 0, vars = [ "GIT_FOUND" ];

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

            if (command === 'set' && line.match(/^[a-zA-Z0-9_]+(?= )/m)) {
                let newVar = line.match(/^[a-zA-Z0-9_]+(?= )/m)[0];
                line = line.replace(/^[a-zA-Z0-9_]+ /m, '');
                vars.push(newVar);
                html += `<span class="yellow">${newVar}</span> `;

                html += `<span class="green">${line}</span>`;
            } else if (command === 'add_compile_definitions') {
                let newDef = line.match(/^[a-zA-Z0-9_]+/m)[0];
                line = line.replace(/^[a-zA-Z0-9_]+/m, '');
                html += `<span class="yellow">${newDef}</span>`;

                html += `<span class="green">${line}</span>`;
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
