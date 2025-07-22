async function getDrinkData(drinkId) {
  try {
    const sectionDrinks = document.getElementById("sectionDrinks");
    sectionDrinks.style.display = 'none'
    
    const response = await fetch(`${API_URL}/lookup.php?i=${drinkId}`);
    const result = await response.json();
    const drink = result.drinks[0];    
    
    const drinkName = document.querySelector(".drink__name");
    drinkName.textContent = drink.strDrink;

    const drinkImage = document.querySelector(".drink__image");
    drinkImage.src = drink.strDrinkThumb;

    const drinkDescription = document.querySelector(".drink__description");
    drinkDescription.textContent = drink.strInstructionsES
 || drink.strInstructions;

    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];        
        if (ingredient) {
            ingredients.push(ingredient);
        }
    }
    const drinkIngredients = document.querySelector(".drink__ingredients");
    let columnaContainer = null;
    ingredients.forEach(i => {
        if (i <= 7 ) {
        drinkIngredients.innerHTML += `<li>${i}</li>`    
        }else {
            if(!columnaContainer){
                columnaContainer = document.createElement("div");
                columnaContainer.classList.add("columna-container");
                drinkIngredients.appendChild(columnaContainer);
            }
            columnaContainer.innerHTML += `<li>${i}</li>`
        }
        
    })
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);

  const drinkId = urlParams.get("drinkId");

  if (drinkId) {
    getDrinkData(drinkId);
  } else {
    console.log('No se encontró el parámetro "productId" en la URL.');
  }
});
