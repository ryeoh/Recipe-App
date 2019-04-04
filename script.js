'use strict';

// API id and key
const apiId='704d2f01';
const apiKey='3b12632722c36daa6c39c86fa28c6927';

// basic API url
const searchUrl='https://api.yummly.com/v1/api/recipes';

// Format string 
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)} = ${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

// Watch form for input
function watchForm() {
    const includes = [];
    const excludes = [];
    $('.inc-form').submit(event => {
        event.preventDefault();
        includes.push($('.incIngred').val());
        $('.includes-list').html(`<li>${includes}</li>`);
    });
    $('.exc-form').submit(event => {
        event.preventDefault();
        excludes.push($('.excIngred').val());
        $('.excludes-list').html(`<li>${excludes}</li>`);
    });
    console.log(includes, excludes);
}

// Make call to Yummly API for "search recipes"
function searchRecipes(includes, excludes) {
    let params = {
        'api_id': apiId,
        'api_key': apiKey,
        q: includes,
        excludedIngredients: excludes
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
        .then(responseJson => console.log(responseJson))
        .catch(err => {
            $('.error-message').text(`Something went wrong: ${err.message}`);
        });
}

// Display the results
function displayResults(responseJson) {
    console.log(responseJson);

}

// Make call to API for "get recipes"
// function getRecipes() {
    // Listen for click on a recipe
//     $('').on('click', event => {
        
//     });
// }
    

$(watchForm);
