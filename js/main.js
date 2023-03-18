// all regular expressions
let nameRegex = /^[a-zA-Z]{3,10}$/;
let emailRegex = /^\w+\@\w+\.\w+/;
let ageRegex = /\d/;
let phoneRegex = /^(01)[0125][0-9]{8}/;
let passwordRegex = /(?=.*?[a-z])(?=.*?[0-9]).{8,}/;
let userName= false, email= false, phone= false, age= false, password= false, repassword= false;

// all api endpoints
let api = {
    categories : 'https://www.themealdb.com/api/json/v1/1/categories.php',
    categoryMeals : 'https://www.themealdb.com/api/json/v1/1/filter.php?c=',
    areas : 'https://www.themealdb.com/api/json/v1/1/list.php?a=list',
    areaMeals : 'https://www.themealdb.com/api/json/v1/1/filter.php?a=',
    ingredients: 'https://www.themealdb.com/api/json/v1/1/list.php?i=list',
    ingredientMeals : 'https://www.themealdb.com/api/json/v1/1/filter.php?i=',
    firstLetter : 'https://www.themealdb.com/api/json/v1/1/search.php?f=',
    searchByName : 'https://www.themealdb.com/api/json/v1/1/search.php?s=',
    mealId : 'https://www.themealdb.com/api/json/v1/1/lookup.php?i='
};
let navLinksWidth = $('.side-nav-links').innerWidth();

// loading page
$(document).ready( async function() { 
    let main = await getData(api.searchByName); 
    display(main.meals); // display main meals

    $('#side-nav-toggle').click(function(){ // open and close side navbar
        if($(this).hasClass('fa-bars')){ 
            $('.side-nav').animate({left: "0px"}, 500,function(){
                $('ul li').fadeIn(200)
            });
            $(this).toggleClass('fa-bars fa-close');
        }else{
            $('ul li').fadeOut(100,function(){
                $('.side-nav').animate({left: -navLinksWidth}, 500)
            });
            $(this).toggleClass('fa-bars fa-close');
        }
    });
    $('.loader').fadeOut(1000);
});



async function getData(api){ // get data from api
    if($('#side-nav-toggle').hasClass('fa-close')){ 
        $('ul li').fadeOut(100);
        $('.side-nav').animate({left: -navLinksWidth}, 500);
        $('#side-nav-toggle').toggleClass('fa-bars fa-close');
    }
    $('#search').css({display: 'none'});
    $('.loader').css({display: 'block'});
    let res = await fetch(api);
    let data  = await res.json();
    return data;
}

function display(items){
    let container = '';
    console.log(items);
    for (const item of items) {
        container += `
        <div class="col-md-3" onclick="mealHandler('${api.mealId + item.idMeal}')">
            <div class="image rounded-3 position-relative">
                <img src="${item.strMealThumb}" class="w-100 rounded-3" alt="${item.strMeal}" />
                <div
                    class="layer position-absolute inset rounded-3 bg-white bg-opacity-75 d-flex align-items-center px-2">
                    <h3>${item.strMeal}</h3>
                </div>
            </div>
        </div>`;
    }
    $('main .root').html(container);
    $('.loader').fadeOut(1000);
}
async function categoryHandler(api){
    let data = await getData(api);
    let meals = data.meals;
    console.log(meals);
    display(meals);
}
async function mealHandler(api){
    let data = await getData(api);
    let meal = data.meals[0];
    console.log(meal);
    let container = `
        <div class="col-md-4">
            <div>
                <img src="${meal.strMealThumb}" class="w-100 rounded-3" alt="">
                <h1 class="py-2 text-white">${meal.strMeal}</h1>
            </div>
            </div>
            <div class="col-md-8 text-white">
                <h3>Instructions</h3>
                <p>${meal.strInstructions}</p>
                <h3>area: ${meal.strArea}</h3>
                <h3>category: <span>${meal.strCategory}</span></h3>
                <h3>recipes:</h3>
                <div>
                    ${ingredients(meal)}
                </div>
        </div>`
        $('main .root').html(container);
        $('.loader').fadeOut(500);
}
function ingredients(obj){
    if($('#side-nav-toggle').hasClass('fa-close')){
        $('ul li').fadeOut(100);
        $('.side-nav').animate({left: -navLinksWidth}, 500);
        $('#side-nav-toggle').toggleclass('fa-bars fa-close');
    }
    let container = '';
    let i = 1;
    do {
        container += `
        <div class="d-inline-block bg-success border-1 border rounded-3 p-2 m-2">${obj['strIngredient'+i]} ${obj['strMeasure'+i]}</div>
        `
        i++;
    } while (obj['strIngredient'+i] != "");
    return container;
}

async function displaySearch(){
    let data = await getData(api.categories);
    let categories = data.categories;
    let container = '';
    let categoryApi;
    for (const category of categories){
        categoryApi = api.categoryMeals + category.strCategory;
        container += `
            <div class="col-lg-3" onclick="categoryHandler('${categoryApi}')">
                <div class="image position-relative">
                    <img src="${category.strCategoryThumb}" class="w-100" alt="">
                    <div class="layer position-absolute inset text-center rounded-3 bg-white bg-opacity-75  p-2">
                        <h4>${category.strCategory}</h4>
                        <p>${category.strCategoryDescription.slice(0, 100)}</p>
                    </div>
                </div>
            </div>`
        $('main .root').html(container);
        $('.loader').fadeOut(1000);
    }
}
async function displayCategories(){
    let data = await getData(api.categories);
    let categories = data.categories;
    let container = '';
    let categoryApi;
    for (const category of categories){
        categoryApi = api.categoryMeals + category.strCategory;
        container += `
            <div class="col-lg-3" onclick="categoryHandler('${categoryApi}')">
                <div class="image position-relative">
                    <img src="${category.strCategoryThumb}" class="w-100" alt="">
                    <div class="layer position-absolute inset text-center rounded-3 bg-white bg-opacity-75  p-2">
                        <h4>${category.strCategory}</h4>
                        <p>${category.strCategoryDescription.slice(0, 100)}</p>
                    </div>
                </div>
            </div>`
        $('main .root').html(container);
        $('.loader').fadeOut(1000);
    }
}
async function displayAreas(){
    let data = await getData(api.areas);
    console.log(data);
    let areas = data.meals;
    let container = '';
    for (const area of areas){
        container += `
            <div class="col-lg-3" onclick="categoryHandler('${api.areaMeals + area.strArea}')">
                <div class="text-center text-white">
                    <i class="fa-solid fa-house-laptop fa-5x "></i>
                    <p class="fw-semi-bold fs-3 mt-2">${area.strArea}</p>
                </div>
            </div>`
        $('main .root').html(container);
        $('.loader').fadeOut(1000);
    }
}
async function displayIngredients(){
    let data = await getData(api.ingredients);
    let ingredients = data.meals;
    console.log(ingredients);
    let container = '';
    for (const ingredient of ingredients){
        if(ingredient.strDescription){
            container += `
            <div class="col-lg-3" onclick="categoryHandler('${api.ingredientMeals + ingredient.strIngredient}')">
                <div class="text-center text-white px-2">
                    <i class="fa-solid fa-drumstick-bite fa-5x "></i>
                    <h4 class="py-3">${ingredient.strIngredient}</h4>
                    <p>${ingredient.strDescription.substring(0,100)}</p>
                </div>
            </div>`
        }
    }
    $('main .root').html(container);
    $('.loader').fadeOut(1000);
}

$('ul li:not(:last-child)').click(function(){
    if($('.contact').css('display') != 'none'){
        $('.contact').fadeOut(1000);
    }
});
$('.search').click(function(){
    $('#search').slideDown(1000);
    $('main .root').html('');
});
$('.category').click(displayCategories);
$('.area').click(displayAreas);
$('.ingredients').click(displayIngredients);
$('.contact').click(function(){
    $('#search').css({display: 'none'});
    $('main .root').html('');
    $('#contact').fadeIn(1000);
});


function activateButton(){ //change submit button to active
    if(userName && email && phone && age && password && repassword){
        $('#submit-button').removeClass('disabled');
    }else{
        $('#submit-button').addClass('disabled')
    }
}

function regexValidator(regex, element){ // validate user data
    if(regex.test(element.val())){
        element.next().addClass('d-none');
        return true
    }else{
        element.next().removeClass('d-none');
        return false;
    }
}
// event to validate user data
$('#name').keyup(function (e) { 
    if(regexValidator(nameRegex ,$(this))){
        userName = true;
    }else{
        userName = false;
    }
    activateButton()
});
$('#email').keyup(function (e) { 
    if(regexValidator(emailRegex ,$(this))){
        email = true;
    }else{
        email = false;
    }
    activateButton()
});
$('#phone').keyup(function (e) { 
    if(regexValidator(phoneRegex ,$(this))){

        phone = true;
    }else{
        phone = false;
    };
    activateButton()
});
$('#age').keyup(function (e) { 
    if(regexValidator(ageRegex ,$(this))){
        age = true;
    }else{
        age = false;
    };
    activateButton()
});
$('#password').keyup(function (e) { 
    if(regexValidator(passwordRegex ,$(this))){
        password = true;
    }else{
        password = false;
    };
    activateButton()
});
$('#repassword').keyup(function (e) { 
    if($(this).val() == $('#password').val()){
        $(this).next().addClass('d-none');
        repassword = true;
    }else{
        $(this).next().removeClass('d-none');
        repassword = false;
    }
    activateButton()
});





async function search(target){
    let searchApi = api.searchByName + target.value;
    let searchResult = await getData(searchApi);
    display(searchResult.meals);    
}
