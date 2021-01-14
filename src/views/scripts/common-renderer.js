/*global $*/

const ipcRenderer = require('electron').ipcRenderer;

function capitalize(word) {
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function navigateToPage(page) {
    $('div[id$="-page"').hide();
    $('a[id$="-nav-link"').removeClass('active');
    $(`#${page}-page`).show();
    $(`#${page}-nav-link`).addClass('active');
    eval(`render${capitalize(page)}()`);
}

$(document).ready(() => {
    navigateToPage('generator');
})

