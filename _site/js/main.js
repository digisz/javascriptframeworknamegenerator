var nounlist = [];
var adjectives = [];
var buttons = [];
var holdon = [];

$( document ).ready(function() {
  $("#theNoun").hide(0);
  $("#frameworkname").hide(0);
  $("#makeName").hide(0);
  $("#hold").text("loading...")
  var removeEmptyFilter = function (item) {
    return item.trim().length > 0
  };
  $.when(
    $.get('txt/nounlist.txt').done(function(data) {
      nounlist = data.split("\n").filter(removeEmptyFilter);
    }),
    $.get('txt/adjectives.txt').done(function(data) {
      adjectives = data.split("\n").filter(removeEmptyFilter);
    }),
    $.get('txt/buttons.txt').done(function(data) {
      buttons = data.split("\n").filter(removeEmptyFilter);
    }),
    $.get('txt/hold.txt').done(function(data) {
      holdon = data.split("\n").filter(removeEmptyFilter);
    })
  ).then(function () {
    randomAdj();
    randomName();
    randomMsg();
    ga('send', {
      hitType: 'event',
      eventCategory: 'RandomName',
      eventAction: 'FirstTime'
    });
  });

  $( "#makeName" ).click(function() {
    randomMsg();
    randomName();
    randomAdj();
    ga('send', {
      hitType: 'event',
      eventCategory: 'RandomName',
      eventAction: 'TryAgain'
    });
  });
});

function randomMsg() {
  // Insert text into button
  var randButton = Math.floor(Math.random() * buttons.length);
  $("#makeName").text(buttons[randButton]);
  // Insert text into waiting message
  var randHold = Math.floor(Math.random() * holdon.length);
  $("#hold").text(holdon[randHold]);
};

function randomAdj() {
  // extract a adjective
  var randAdj = Math.floor(Math.random() * adjectives.length);
  // load definition
  $.ajax({
    url: "https://api.datamuse.com/words?sp="+adjectives[randAdj]+"&md=d"
  }).done(function(data) {
    var randDef = Math.floor(Math.random() * data[0].defs.length);
    var str=data[0].defs[randDef].substring(data[0].defs[randDef].replace('\t', ' ').indexOf(' ')+1);
    $("#definition").text(str.charAt(0).toUpperCase() + str.slice(1));
  });

  // display the noun and show everything again
  $("#theAdj").text(adjectives[randAdj]);
}

function randomName() {
  // Hide the latest name and the button
  $("#theNoun").hide(0);
  $("#frameworkname").hide(0);
  $("#makeName").hide(0);
  // generate a random time for the delay
  var delay = Math.floor(Math.random() * 1000) + 1500
  // show the animation for some time
  $("#trnt").fadeIn(200).delay(delay).slideUp(300);
  // extract a noun
  var randLineNum = Math.floor(Math.random() * nounlist.length);
  // load definition
  $.ajax({
    url: "https://api.datamuse.com/words?sp="+nounlist[randLineNum]+"&md=d"
  }).done(function(data) {
    if (typeof data[0].defs === 'undefined') {
      $("#description").hide();
    } else {
      var randDef = Math.floor(Math.random() * data[0].defs.length);
      var str=data[0].defs[randDef].substring(data[0].defs[randDef].replace('\t', ' ').indexOf(' ')+1);
      // display the noun and show everything again
      $("#description").text(str.charAt(0).toUpperCase() + str.slice(1)).show();
    }
  }).always(function() {
    $("#theNoun").text(nounlist[randLineNum]).slideDown(200);
    $("#frameworkname").delay(delay).slideDown(200); // random line from the text file
    $("#makeName").delay(delay).slideDown(200);
  })

}
