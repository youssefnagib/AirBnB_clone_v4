$(document).ready(init);

const amenity_Obj = {};
const state_City_Obj = {};

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


  $('.state_input').change(function () {
    if ($(this).is(':checked')) {
      state_City_Obj[$(this).attr('data-name')] = $(this).attr('data-id');
    } else {
      delete state_City_Obj[$(this).attr('data-name')];
    }
    update_state_city();
  });


  $('.city_input').change(function () {
    if ($(this).is(':checked')) {
      state_City_Obj[$(this).attr('data-name')] = $(this).attr('data-id');
    } else {
      delete state_City_Obj[$(this).attr('data-name')];
    }
    update_state_city();
  });
}

function update_state_city() {
  const state_city_ids = Object.values(state_City_Obj);
  const names = Object.keys(state_City_Obj);
  $('.locations h4').text(names.sort().join(', '));
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

function getPlaceReviews(placeId) {
  return $.get('http://0.0.0.0:5001/api/v1/places/' + placeId + '/reviews/', function (data) {
    return data;
  })
}

function getReviewsHtml(reviews) {
  let ret = '<ul>'
  if (reviews.length === 0)
    return '';
  reviews.forEach(function (review) {
    ret += `<li>` + `<h3>From ${review.user_id} the ${review.created_at}</h3>` +
      `<p>${review.text}</p>` + `</li>`;
  });
  return ret + '</ul>';
}

function removeReviewsFromArticle(placeId) {
  $(`#articles_${placeId} .reviews ul`).remove();
}

function addReviewsToArticle(placeId) {
  getPlaceReviews(placeId).then((reviews) => {
    const htmlString = getReviewsHtml(reviews);
    console.log(placeId)
    console.log(`#articles_${placeId}`)
    console.log($(`#articles_${placeId}`));
    $(`#articles_${placeId} .reviews`).append(htmlString);
  });
}

function addPlaceReviewsShowClick() {
  $('span').click(function () {
    const text = $(this).text();
    if (text === 'show')
    {
      addReviewsToArticle(this.dataset.place_id);
      $(this).text('hide');
    }
    else {
      removeReviewsFromArticle(this.dataset.place_id);
      $(this).text('show');
    }
  });
}

function addPlaceArticle(place, reviews) {
  const article = [`<article id="articles_${place.id}">`,
    '<div class="title_box">',
    `<h2>${place.name}</h2>`,
    `<div class="price_by_night">$${place.price_by_night}</div>`,
            '</div>',
            '<div class="information">',
            `<div class="max_guest">${place.max_guest} Guest(s)</div>`,
            `<div class="number_rooms">${place.number_rooms} Bedroom(s)</div>`,
            `<div class="number_bathrooms">${place.number_bathrooms} Bathroom(s)</div>`,
            '</div>',
            '<div class="description">',
            `${place.description}`,
            '</div>',
            '<div class=reviews>',
            `<h2 class="review_number"> ${reviews.length} Reviews</h2>`,
            `<span data-place_id="${place.id}" ">show</span>`,
            // '<ul>',
            // reviewsHtml,
            // '</ul>',
            '</div>', // end of reviews div
            '</article>'];
          $('SECTION.places').append(article.join(''));
}

async function Places (queryFilter={}) {
    const PLACES_URL = `http://0.0.0.0:5001/api/v1/places_search/`;
    $('article').remove();
    $.ajax({
      url: PLACES_URL,
      type: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(queryFilter),
      success: function (response) {
        for (const place of response) {
          let x = null;
          getPlaceReviews(place.id).then((reviews) => {
            addPlaceArticle(place, reviews);
            addPlaceReviewsShowClick();
          })
        }
      },
      error: function (error) {
        console.log(error);
      }
    });
}
function search_button_click() {
  const amenity_ids = Object.values(amenity_Obj);
  const state_city_ids = Object.values(state_City_Obj);
  
  const queryFilter = {
    amenities: amenity_ids,
    states: state_city_ids,
    cities: state_city_ids
  };
  
  Places(queryFilter);
}
function init() {
  $('.amenities .popover input').change(function () {
    obj = amenityObj;
    checkedObjects.call(this, 1);
  });
  $('.state_input').change(function () {
    obj = stateObj;
    checkedObjects.call(this, 2);
  });
  $('.city_input').change(function () {
    obj = cityObj;
    checkedObjects.call(this, 3);
  });
  set_api_available();
  Places();
  $('#search_button').click(search_button_click);
}
