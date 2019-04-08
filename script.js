'use strict';

// API id and key
const apiId='704d2f01';
const apiKey='3b12632722c36daa6c39c86fa28c6927';

// basic API url
const searchUrl='https://api.yummly.com/v1/api/recipes';

// Format string 
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

const includes = [];
const excludes = [];

// Watch form for input and capture input values into variables
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        if ('input[type=text].incIngred' !== '') {
            $('input[type=text].incIngred').each(function(i) {
                includes[i] = $(this).val();
            });
        }
        $(':checkbox:checked').each(function(i) {
            excludes[i] = $(this).val();
        });
        if ('input[type=text].excIngred' !== '') {
            $('input[type=text].excIngred').each(function(i) {
                excludes[i] = $(this).val();
            });
        }
        console.log(includes);
        console.log(excludes);
    })
    startSearch();
}

// Listen for "add more" click to  include more ingredients to create an additional input
function addIngred() {
    $('.addMore').click(function() {
        $('.includeIngredients').append(`<input type="text" class="incIngred">`);
    })
}

// Listen for "add exc" click to create additional input boxes
function excIngred() {
    $('.addExc').click(function() {
        $('.excludeIngredients').append(`<input type="text" class="excIngred">`);
    })
}

// Once all the inputs are chosen, listen for "Go" click to make call to "search recipes"
function startSearch() {
    $('.start-search').click(function() {
        console.log('click!');
        searchRecipes(includes, excludes);
    });
}

// Make call to Yummly API for "search recipes"
function searchRecipes(includes, excludes) {
    let params = {
        '_app_id': apiId,
        '_app_key': apiKey,
        q: includes,
        excludedIngredient: excludes
    };
    const queryString = formatQueryParams(params);
    const url1 = searchUrl + '?' + queryString;

    console.log(url1);

    fetch(url1)
        .then(response => {
            if (response.ok) {
                return response.json();
            } throw new Error (response.statusText);
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
            `<li><h3>${responseJson.matches[i].recipeName}</h3><br><img src='${responseJson.matches[i].smallImageUrls}'></li>`
    )};
    // display results section
    $('.results').removeClass('hidden');
}

// Make call to API for "get recipes"
function getRecipes(responseJson) {
    // Listen for click on a recipe
    const recipeId = `${responseJson.matches[i].id}`;
    const url2 = searchUrl + '?' + recipeId + formatQueryParams(params);
    console.log(url2);
//     $('').on('click', event => {
        
//     });
}
    

$(function() {
    watchForm();
    addIngred();
    excIngred();
    // startSearch();
    // getRecipes()
})
