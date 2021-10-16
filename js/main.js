var nounlist = [];
var adjectives = [];
var buttons = [];
var holdon = [];

$( document ).ready(function() {
  $("#theName").hide(0);
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
    randomNoun();
    go();
    randomMsg();
    yolo();
    ga('send', {
      hitType: 'event',
      eventCategory: 'go',
      eventAction: 'FirstTime'
    });
  });

  $( "#makeName" ).click(function() {
    setLast();
    randomMsg();
    randomNoun();
    go();
    yolo();
    randomAdj();
    ga('send', {
      hitType: 'event',
      eventCategory: 'go',
      eventAction: 'TryAgain'
    });
  });
  
  $( "#recall" ).click(function() {
    go();
    var recallLast = getCookie("last").split("!");
    var recallAdj = recallLast[0];
    var recallNoun = recallLast[1];
    define(recallAdj, recallNoun);
    $("#theNoun").text(recallNoun);
    $("#theAdj").text(recallAdj);
  });
});

function getCookie(name) {
  var regexp = new RegExp("(?:^" + name + "|;\s*"+ name + ")=(.*?)(?:;|$)", "g");
  var result = regexp.exec(document.cookie);
  return (result === null) ? null : result[1];
}

function setLast() {
  // Saves current words to cookie for potential recall
  var CookieDate = new Date;
    CookieDate.setFullYear(CookieDate.getFullYear() + 1);
  document.cookie = "last="+currentAdj+"!"+currentNoun+"; expires=" + CookieDate.toUTCString() + ";";
};

function randomMsg() {
  // Insert text into button
  var randButton = Math.floor(Math.random() * buttons.length);
  $("#makeName").text(buttons[randButton]);
  // Insert text into waiting message
  var randHold = Math.floor(Math.random() * holdon.length);
  $("#hold").text(holdon[randHold]);
};

function yolo() {
  nounlist = nounlist.filter(e => e !== currentNoun);
  console.log(nounlist.length);
  adjectives = adjectives.filter(e => e !== currentAdj);
  console.log(adjectives.length);
}

//should be able to DRY definitions up
function define(adj, noun) {
  $.ajax({
    url: "https://api.datamuse.com/words?sp="+adj+"&md=d"
  }).done(function(data) {
    var randDef = Math.floor(Math.random() * data[0].defs.length);
    var str=data[0].defs[randDef].substring(data[0].defs[randDef].replace('\t', ' ').indexOf(' ')+1);
    $("#definition").text(str.charAt(0).toUpperCase() + str.slice(1));
  });
  $.ajax({
    url: "https://api.datamuse.com/words?sp="+noun+"&md=d"
  }).done(function(data) {
    var randDef = Math.floor(Math.random() * data[0].defs.length);
    var str=data[0].defs[randDef].substring(data[0].defs[randDef].replace('\t', ' ').indexOf(' ')+1);
    $("#description").text(str.charAt(0).toUpperCase() + str.slice(1));
  });
}

function randomAdj() {
  // extract a adjective
  var randAdj = Math.floor(Math.random() * adjectives.length);
  currentAdj = adjectives[randAdj];
  // load definition
  $.ajax({
    url: "https://api.datamuse.com/words?sp="+currentAdj+"&md=d"
  }).done(function(data) {
    var randDef = Math.floor(Math.random() * data[0].defs.length);
    var str=data[0].defs[randDef].substring(data[0].defs[randDef].replace('\t', ' ').indexOf(' ')+1);
    $("#definition").text(currentAdj + ": \"" + str.charAt(0).toUpperCase() + str.slice(1) + "\"");
  });

  // display the adj and show everything again
  $("#theAdj").text(currentAdj);
}

function randomNoun() {
  // extract a noun
  var randLineNum = Math.floor(Math.random() * nounlist.length);
  currentNoun = nounlist[randLineNum];
  // load definition
  $.ajax({
    url: "https://api.datamuse.com/words?sp="+currentNoun+"&md=d"
  }).done(function(data) {
    if (typeof data[0].defs === 'undefined') {
      $("#description").hide();
    } else {
      var randDef = Math.floor(Math.random() * data[0].defs.length);
      var str=data[0].defs[randDef].substring(data[0].defs[randDef].replace('\t', ' ').indexOf(' ')+1);
      // display the noun and show everything again
      $("#description").text(currentNoun + ": \"" + str.charAt(0).toUpperCase() + str.slice(1) + "\"").show();
    };
  })
  $("#theNoun").text(currentNoun);
};

function go() {
  // Hide the latest name and the button
  $("#theName").hide(0);
  $("#frameworkname").hide(0);
  $("#makeName").hide(0);
  $("#caret").hide(0);
  // generate a random time for the delay
  var delay = Math.floor(Math.random() * 1000) + 1500
  // show the animation for some time
  $("#trnt").fadeIn(200).delay(delay - 200).hide(0);
  $("#frameworkname").delay(delay).slideDown(200); // random line from the text file
  $("#makeName").delay(delay).slideDown(200);
  $("#caret").delay(delay).slideDown(200);
  $("#theName").delay(delay).slideDown(200);
  $("#theMeaning").delay(delay).slideDown(200);
};
