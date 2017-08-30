$( document ).ready(function() {
randomName();

  $( "#generate" ).click(function() {
    randomName();
    ga('send', {
  hitType: 'event',
  eventCategory: 'RandomName',
  eventAction: 'TryAgain'
});
      });
});

function randomName() {
    $.get('txt/nounlist.txt', function(txt) {
      // Hide the latest name and the button
      $("#frameworkname").hide(0);
      $("#generate").hide(0);
      // generate a random time for the delay
      var delay = Math.floor(Math.random() * 2000) + 1500
      // show the animation for some time
      $("#trnt").fadeIn(200).delay(delay).slideUp(300);  
      // extract a noun
        var lines = txt.split("\n");
        var randLineNum = Math.floor(Math.random() * lines.length);
        // display the noung and show everything again
        $("#frameworkname").html(lines[randLineNum]+".JS").delay(delay).slideDown(200); // random line from the text file
        $("#generate").delay(delay).slideDown(200);
    });
}
