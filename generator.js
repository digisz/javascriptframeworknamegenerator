$('button').click(function() {
    $('h2').text(randomEl(adjectives)+' '+randomEl(nouns));
    selectElementContents($('h2')[0]);
});

function randomEl(list) {
    var i = Math.floor(Math.random() * list.length);
    return list[i];
}

function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

$('button').click();
