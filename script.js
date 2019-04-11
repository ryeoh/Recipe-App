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
    let search = $('.gen-search').val();
    let includes = [];
    let excludes = [];
    if ($('.incIngred').val() !== "") {
      $('.incIngred').each(function (i) {
        includes[i] = $(this).val();
      });
    }

    if ($('.excIngred').val() !== "") {
      $('.excIngred').each(function (i) {
        excludes[i] = $(this).val();
      });
    }
    searchRecipes(search, includes, excludes);
  })
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

// Listen for "add more" click to  include more ingredients to create an additional input
function addIngred() {
  $('.addMore').click(function () {
    $('.includeIngredients').append(`<input type="text" class="incIngred">`);
  })
}

// Listen for "add exc" click to create additional input boxes
function excIngred() {
  $('.addExc').click(function () {
    $('.excludeIngredients').append(`<input type="text" class="excIngred">`);
  })
}

// Make call to Yummly API for "search recipes"
function searchRecipes(search, includes, excludes) {
  let params1 = {
    '_app_id': apiId,
    '_app_key': apiKey,
    q: search,
  };

  console.log(includes);
  console.log(excludes);

  console.log(params1);

  const queryString = formatQueryParams(params1, includes, excludes);
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
  // iterate through the items array
  for (let i = 0; i < responseJson.matches.length; i++) {
    $('.results-list').append(
      `<li><a class='recipe-details' href='${recipeUrl}/${responseJson.matches[i].id}?_app_id=${apiId}&_app_key=${apiKey}'><h3>${responseJson.matches[i].recipeName}</h3></a><br><img src='${responseJson.matches[i].smallImageUrls}'></li>`
    )
  };
  // display results section
  $('.results').removeClass('hidden');
  getRecipes(responseJson);
}

// Make call to API for "get recipes"
function getRecipes(responseJson) {
  // Listen for click on a recipe
  const params2 = {
    '_app_id': apiId,
    '_app_key': apiKey
  }
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
        $('.error-message').text(`Something went wrong: ${err.message}`);
      });
  });
}

// Display the details of selected recipe
function displayDetails(responseJson) {
  console.log(responseJson);
  const ingredientsList = makeIngredientsList(responseJson.ingredientLines);
  $('.results-list').empty();
  $('.results-list').append(`<a href="${responseJson.source.sourceRecipeUrl}"><h2>${responseJson.name}</h2></a>
    <ul><li>Yields: ${responseJson.yield}</li>
        <li>Prep time: ${responseJson.prepTime}</li>
        <li>Cook time: ${responseJson.cookTime}</li>
        <li>Total time: ${responseJson.totalTime}</li>
    </ul>
  <img src='${responseJson.images[0].hostedLargeUrl}' alt='picture of resulting food'>
      <ul>${ingredientsList}</ul>
  `);
}

// Make ingredients list
function makeIngredientsList(ingredientArr) {
  let ingredHtml = '';
  for (let i = 0; i < ingredientArr.length; i++) {
    ingredHtml += `<li>${ingredientArr[i]}</li>`
  };
  return ingredHtml;
}


$(function () {
  watchForm();
  addIngred();
  excIngred();
  // startSearch();
  // getRecipes()
})
