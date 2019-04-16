'use strict';

// API id and key
const apiId = '704d2f01';
const apiKey = '3b12632722c36daa6c39c86fa28c6927';

// base API urls for the 2 endpoints
const searchUrl = 'https://api.yummly.com/v1/api/recipes';
const recipeUrl = 'https://api.yummly.com/v1/api/recipe';

// Watch form for input and capture input values into variables
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    let includes = [];
    let excludes = [];
    $('.incIngred').each(function(i) {
      includes[i] = $(this).val();
    });
    $('.excIngred').each(function(i) {
      excludes[i] = $(this).val();
    });
    cleanArr(includes, excludes);
  })
}

// Reset form for new search
function resetForm() {
  $('.reset').on('click', function(e) {
    e.preventDefault();
    $('.results-list').empty();
    $('.result-details').empty();
    $('.error-message').empty();
    $('.go-back').addClass('hidden');
    $('.form').trigger('reset');
  });
}

// Remove values in the includes/excludes arrays that are blank or empty strings
function cleanArr(includes, excludes) {
  let includes2 = includes.filter(value => value !== '');
  let excludes2 = excludes.filter(value => value !== '');
  let search = $('.gen-search').val();
  for (let i=0; i < includes2.length; i++) {
    if (excludes2.includes(includes[i])) {
      $('.error-message').text('Something went wrong: You are excluding and including the same ingredient! Please try another search.');
      return false;
    } else {
      $('.error-message').empty();
    }
  }
  searchRecipes(search, includes2, excludes2);
}

// Format string 
function formatQueryParams(params, includes, excludes) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);

  let queryString = queryItems.join('&');
  includes.forEach(included => {
    queryString += `&allowedIngredient=${included}`;
  });
  excludes.forEach(excluded => {
    queryString += `&excludedIngredient=${excluded}`;
  });
  return queryString;
}

// Create an new input box to include more ingredients
function addIngred() {
  $('.addMore').click(function () {
    $('.inc-inputs').append(`<input type="text" class="incIngred">`);
    $('.incIngred').focus();
  })
}

// Create an new input box to exclude more ingredients
function excIngred() {
  $('.addExc').click(function () {
    $('.exc-inputs').append(`<input type="text" class="excIngred">`);
    $('.excIngred').focus();
  })
}

// Make call to Yummly API for "search recipes"
function searchRecipes(search, includes, excludes) {
  let params = {
    '_app_id': apiId,
    '_app_key': apiKey,
    q: search,
  };
  console.log(includes);
  console.log(excludes);

  const queryString = formatQueryParams(params, includes, excludes);
  const url1 = searchUrl + '?' + queryString;

  console.log(url1);
  fetch(url1)
    .then(response => {
      if (response.ok) {
        return response.json();
      } throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('.error-message').text(`Something went wrong: ${err.message}`);
    });
}

// Display the results
function displayResults(responseJson) {
  console.log(responseJson);
  $('.results-list').empty();
  if (responseJson.matches === undefined || responseJson.matches.length === 0) {
    $('.error-message').text('There were no recipes found that matches those ingredients. Please try another search!')
  }
  for (let i = 0; i < responseJson.matches.length; i++) {
    $('.results-list').append(
      `<ul><a class='recipe-details' href='${recipeUrl}/${responseJson.matches[i].id}?_app_id=${apiId}&_app_key=${apiKey}'><li><h3>${responseJson.matches[i].sourceDisplayName}: ${responseJson.matches[i].recipeName}</h3><p>Yummly rating: ${responseJson.matches[i].rating} out of 5 stars</p><br><img src='${responseJson.matches[i].smallImageUrls}'></li></a></ul>`
    )
  };
  $('.results-list').removeClass('hidden');
  scrollPage();
  getRecipes();
}

// smooth scroll affect
function scrollPage() {
  $('body, html').animate({
    scrollTop: $('.results').offset().top - 20}, 1000);
};

// Make call to API for "get recipes"
function getRecipes() {
  $('.recipe-details').on('click', function (event) {
    event.preventDefault();
    const url2 = $(this).attr("href");
    console.log(url2);

    fetch(url2)
      .then(response => {
        if (response.ok) {
          return response.json();
        } throw new Error(response.statusText);
      })
      .then(responseJson => displayDetails(responseJson))
      .catch(err => {
        console.log(err);
        $('.error-message').text(`Something went wrong: ${err.message}`);
      });
  });
}

// Display the details of selected recipe
function displayDetails(responseJson) {
  console.log(responseJson);
  $('.results-list').addClass('hidden');
  $('.go-back').removeClass('hidden');

  const ingredientsList = makeIngredientsList(responseJson.ingredientLines);
  const htmlString = `<h2><a href="${responseJson.source.sourceRecipeUrl}">${responseJson.source.sourceDisplayName}: ${responseJson.name}</a></h2>
  <ul><li>Yields: ${responseJson.yield}</li>
      <li>Prep time: ${responseJson.prepTime}</li>
      <li>Cook time: ${responseJson.cookTime}</li>
      <li>Total time: ${responseJson.totalTime}</li>
  </ul>
  <img src='${responseJson.images[0].hostedLargeUrl}' alt='picture of resulting food'>
    <ul>${ingredientsList}</ul>`;

  $('.result-details').empty();
  $('.result-details').append(htmlString);
  // Check and replace any values in string that may contain 'undefined' or a blank
  if (htmlString.includes(undefined) || htmlString.includes('')) {
    let newHtmlString = htmlString.replace(/undefined|''/g, 'N/A');
    $('.result-details').html(newHtmlString);
  }
  $('.result-details').removeClass('hidden');
  scrollPage();
  returnToList();
}

// Make ingredients list
function makeIngredientsList(ingredientArr) {
  let ingredHtml = '';
  for (let i = 0; i < ingredientArr.length; i++) {
    ingredHtml += `<li>${ingredientArr[i]}</li>`
  };
  return ingredHtml;
}

// Go back to results-list 
function returnToList() {
  $('.go-back').on('click', function(e) {
    $('.result-details').addClass('hidden');
    $('.go-back').addClass('hidden');
    $('.results-list').removeClass('hidden');
  })
  getRecipes();
}

$(function() {
  watchForm();
  resetForm();
  addIngred();
  excIngred();
})
