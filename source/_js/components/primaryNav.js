
// Containerization for the primary nav
function primaryNav($, patternId) {

  var pattern;


  function init() {
    pattern.attr('jr-init');
  }


  function setEvents() {}


  function docReady() {
    pattern = $("#" + patternId);
    init();
    setEvents();
  }


  return docReady;
}


var PRIMARYNAV = {
  "init":function(){
    // Change ID selecter here!
    $('.c-primaryNav:not([jr-init])').each(function(){
      var id = 'UNIQUEID_' + Math.floor((Math.random() * 999999999) + 1);
      $(this).attr('id', id);
      
      primaryNav(jQuery,id)();
    });
  }
}
