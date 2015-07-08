// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

// $(window).on('scroll.fndtn.magellan', function() {
// 	var originalWidth = $('div[data-magellan-expedition-clone]').width();
// 	$('div[data-magellan-expedition="fixed"]').width(originalWidth);
// });

$(function() {
  $( "#from" ).datepicker({
    dateFormat: 'yy-mm-dd',
    defaultDate: new Date(2012, 6, 1),
    changeMonth: true,
    numberOfMonths: 1,
    minDate: new Date(2012, 6, 1),
    maxDate: new Date(2012, 11, 31),
    onClose: function( selectedDate ) {
      $( "#to" ).datepicker( "option", "minDate", selectedDate );
    }
  });
  $( "#to" ).datepicker({
    dateFormat: 'yy-mm-dd',
    defaultDate: new Date(2012, 6, 1),
    changeMonth: true,
    numberOfMonths: 1,
    minDate: new Date(2012, 6, 1),
    maxDate: new Date(2012, 11, 31),
    onClose: function( selectedDate ) {
      $( "#from" ).datepicker( "option", "maxDate", selectedDate );
    }
  });
});

$(document).ready(function(){
    $("select.flexselect").flexselect();
    $("input.flexselect").attr("placeholder", "Select keyword");
    $('input.timepicker').timepicker({
      timeFormat: 'HH:mm',
      scrollbar: true
    });
});