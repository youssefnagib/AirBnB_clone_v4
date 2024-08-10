$(document).ready(init);

function checkbox_input() {
  const amenity_Obj = {};
  $('.amenities .popover input').change(function () {
    if ($(this).is(':checked')) {
      amenity_Obj[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if ($(this).is(':not(:checked)')) {
      delete amenity_Obj[$(this).attr('data-name')];
    }
    const names = Object.keys(amenity_Obj);
    $('.amenities h4').text(names.sort().join(', '));
  });
}

function set_api_available() {
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    const apiStatusCircle = $('header div#api_status');
    console.log(data['status']);
    if (data['status'] === 'OK') {
      apiStatusCircle.addClass('available');
    } else {
      apiStatusCircle.removeClass('available');
    }
  })
}

function init () {
  checkbox_input();
  set_api_available();
}
