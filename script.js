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
        if ($('.incIngred').val() !== "") {
            includes.push($('.incIngred').val());
        }
        if ($('.excIngred').val() !== "") {
            excludes.push($('.excIngred').val());
        }
        $('.inc-ingred-list').html(`<li>Includes: ${includes}</li>`);
        console.log(includes);
        $('.exc-ingred-list').html(`<li>Excludes: ${excludes}</li>`);
        console.log(excludes);
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
    const url = searchUrl + '?' + queryString;

    console.log(url);

    fetch(url)
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
            `<li><img src='${responseJson.matches[i].smallImageUrls}'><h3>${responseJson.matches[i].recipeName}</h3></li>`
    )};
    // display results section
    $('.results').removeClass('hidden');
}

// Make call to API for "get recipes"
// function getRecipes() {
    // Listen for click on a recipe
//     $('').on('click', event => {
        
//     });
// }
    

$(function() {
    watchForm();
    startSearch();
})
