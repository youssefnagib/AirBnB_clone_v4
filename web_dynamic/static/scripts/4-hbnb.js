$(document).ready(init);

const amenity_Obj = {};
function checkbox_input() {
  $('.amenities .popover input').change(function () {
    if ($(this).is(':checked')) {
      amenity_Obj[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if ($(this).is(':not(:checked)')) {
      delete amenity_Obj[$(this).attr('data-name')];
    }

    const amenity_ids = Object.values(amenity_Obj);
    Places({'amenities': amenity_ids});

    const names = Object.keys(amenity_Obj);
    $('.amenities h4').text(names.sort().join(', '));
  });
}

function set_api_available() {
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    const apiStatusCircle = $('header div#api_status');
    if (data['status'] === 'OK') {
      apiStatusCircle.addClass('available');
    } else {
      apiStatusCircle.removeClass('available');
    }
  })
}
function Places (queryFilter={}) {
    const PLACES_URL = `http://0.0.0.0:5001/api/v1/places_search/`;
    $('article').remove();
    $.ajax({
      url: PLACES_URL,
      type: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(queryFilter),
      success: function (response) {
        for (const r of response) {
          const article = ['<article>',
            '<div class="title_box">',
          `<h2>${r.name}</h2>`,
          `<div class="price_by_night">$${r.price_by_night}</div>`,
          '</div>',
          '<div class="information">',
          `<div class="max_guest">${r.max_guest} Guest(s)</div>`,
          `<div class="number_rooms">${r.number_rooms} Bedroom(s)</div>`,
          `<div class="number_bathrooms">${r.number_bathrooms} Bathroom(s)</div>`,
          '</div>',
          '<div class="description">',
          `${r.description}`,
          '</div>',
          '</article>'];
          $('SECTION.places').append(article.join(''));
        }
      },
      error: function (error) {
        console.log(error);
      }
    });
  }

function init () {
  checkbox_input();
  set_api_available();
  Places();
}
