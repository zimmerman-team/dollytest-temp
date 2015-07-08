// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$(window).on('scroll.fndtn.magellan', function() {
	var originalWidth = $('div[data-magellan-expedition-clone]').width();
	$('div[data-magellan-expedition="fixed"]').width(originalWidth);
});

$(function() {
  $( "#from" ).datepicker({
    changeMonth: true,
    numberOfMonths: 1,
    onClose: function( selectedDate ) {
      $( "#to" ).datepicker( "option", "minDate", selectedDate );
    }
  });
  $( "#to" ).datepicker({
    changeMonth: true,
    numberOfMonths: 1,
    onClose: function( selectedDate ) {
      $( "#from" ).datepicker( "option", "maxDate", selectedDate );
    }
  });
});

$(document).ready(function(){
    $("select.flexselect").flexselect();
    $("input.flexselect").on('click',function(){
      var value = $(this).val();
      if (value.match(/^Select keyword/)) {
        $(this).val("");
      }
    });
});