function getQueryString(name) {
    const pattern = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    const result = window.location.search.substr(1).match(pattern);
    return result === null ? null : decodeURIComponent(result[2]);
}

function newTabulator(selector, options) {
    return new Tabulator(selector, options);
}
