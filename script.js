// console.log("Hello World!")
// It makes favourite list array when doesn't exists in LocalStorage
if (localStorage.getItem("favouritesList") == null) {
  localStorage.setItem("favouritesList", JSON.stringify([]));
}

//It Fetches Meals form Api and Return a Meal
const fetchMeals = async (url, value) => {
  const response = await fetch(`${url + value}`);
  const meals = await response.json();
  return meals;
};

// This Function showing all Meals whose realted to input value
function showMealList() {
  let inputValue = document.getElementById("my-search").value;
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  let html = ``;
  let meals = fetchMeals(url, inputValue);

  meals.then((data) => { 
    if (data.meals) {
      data.meals.forEach((ele) => {  // Iterate all element in meals Object
        console.log(ele);
        let isFav = false;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] == ele.idMeal) {
            isFav = true;
          }
        }

        if (isFav) {  // When meal is favourite then show Glow favourite icon 
          html += `
                    <div id="card" class="card mb-3" style="width: 20rem;">
                      <img src="${ele.strMealThumb}" class="card-img-top" alt="...">
                      <div class="card-body">
                        <h5 class="card-title">${ele.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${ele.idMeal})">More Details</button>
                            <button id="main${ele.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${ele.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                      </div>
                    </div>
                `;
        } else { // when meal not is in Favourite list
          html += `
                   <div id="card" class="card mb-3" style="width: 20rem;">
                     <img src="${ele.strMealThumb}" class="card-img-top" alt="...">
                     <div class="card-body">
                        <h5 class="card-title">${ele.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${ele.idMeal})">More Details</button>
                            <button id="main${ele.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${ele.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                     </div>
                  </div>
            `;
        }
      });
    } else { // When Not match with input value then Show 404 Error 
      html += `
          <div class="page-wrap d-flex flex-row align-items-center">
           <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-12 text-center">
                    <span class="display-1 d-block">Not Found</span>
                    <div class="mb-4 lead">
                        The meal you are looking for was not found.
                    </div>
                </div>
            </div>
          </div>
         </div>
        `;
    }

    document.getElementById("main-card").innerHTML = html;  // extract Main-card Id from DOM then upadte html
  });
}

//it shows full meal details in main-card Setcion
async function showMealDetails(id) {
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = ``;
  await fetchMeals(url, id).then((data) => {
    html += `
          <div id="meal-details" class="mb-5">
            <div id="meal-header" class="d-flex justify-content-around flex-wrap">
              <div id="meal-thumbnail">
                <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
              </div>
              <div id="details">
                <h3>${data.meals[0].strMeal}</h3>
                <h6>Category : ${data.meals[0].strCategory}</h6>
                <h6>Area : ${data.meals[0].strArea}</h6>
              </div>
            </div>
            <div id="meal-instruction" class="mt-3">
              <h5 class="text-center">Instruction :</h5>
              <p>${data.meals[0].strInstructions}</p>
            </div>
            <div class="text-center">
              <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
            </div>
          </div>
        `;
  });
  document.getElementById("main-card").innerHTML = html;
}

// it shows all favourites meals in favourites body
async function showFavMealList() {
  let arr = JSON.parse(localStorage.getItem("favouritesList")); // create array and fetch data from localStorage
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = ``;
  if (arr.length == 0) {
    html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">Not Found</span>
                            <div class="mb-4 lead">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
  } else {
    for (let i = 0; i < arr.length; i++) {
      await fetchMeals(url, arr[i]).then((data) => {
        html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
      });
    }
  }
  document.getElementById("favourites-body").innerHTML = html;
}

// This function for add meal to our favourite List
function addRemoveToFavList(id) {
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let contain = false;
  for (let i = 0; i < arr.length; i++) { // mapping through localStorage array when find then conatin = true
    if (id == arr[i]) {
      contain = true;
    }
  }
  if (contain) {  // if contain is true then remove from Favourite List otherwise push to array
    let number = arr.indexOf(id);
    arr.splice(number, 1);
    alert("Your meal removed from your favourites list");
  } else {
    arr.push(id);
    alert("Your meal add your favourites list");
  }
  localStorage.setItem("favouritesList", JSON.stringify(arr)); // seting the localStorage when removed or add work is done
  showMealList();
  showFavMealList();
}
