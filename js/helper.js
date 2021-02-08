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

function getSelectedLibraries() {
    let selected = [];

    $('.settings-container .selected').each((item, element) => {
        selected.push($(element).attr('id'));
    });

    return selected;
}
