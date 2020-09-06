$.ajaxSetup({ async: false });
const rawCmake = $.get('data/cmake.txt').responseText;
$.ajaxSetup({ async: true });

function getCmake() {
    return rawCmake.replaceAll(';;name;;', projectInfo.name || DEFAULT_NAME)
        .replaceAll(';;version;;', projectInfo.version || DEFAULT_VERSION)
        .replaceAll(';;description;;', projectInfo.description || DEFAULT_DESCRIPTION);
}

function update() {
    let cmake = getCmake();
    $('#result').html(cmakeToHtml(cmake));
}
