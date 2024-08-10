$(document).ready(init);

function init () {
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