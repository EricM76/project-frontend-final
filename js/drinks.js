const API_URL='https://www.thecocktaildb.com/api/json/v1/1'
const sectionDrinks = document.getElementById('sectionDrinks')

async function getDataDrinkById(drinkId) {
     
    const response = await fetch(`${API_URL}/lookup.php?i=${drinkId}`);
    const result = await response.json(); 
    console.log(result);
    
    const drink = result.drinks[0]    
    const flipCards = document.querySelectorAll('.flip-card');

      flipCards.forEach(card => {
        const drinkId = card.querySelector('.flip-card-back').dataset.drinkId;

        const labelAlcoholic = card.querySelector('.label-alcoholic');
        labelAlcoholic.innerHTML = drink.strAlcoholic


    });
}
async function getDrinksByCategory(categoryName) {

  try {

    const response = await fetch(`${API_URL}/filter.php?c=${categoryName}`)
    const result = await response.json();
    sectionDrinks.innerHTML = null

    if(result){
        result.drinks.map(drink => {
            sectionDrinks.innerHTML += `
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                    </div>
                    <div class="flip-card-back" data-drink-id="${drink.idDrink}">
                    <h2>${drink.strDrink}</h2>
                    <button class="label-alcoholic"></button>
                    <button class="label-glass"></button>
                    </div>
                </div>
            </div>
            `
        });

    const flipCards = document.querySelectorAll('.flip-card');

    flipCards.forEach(card => {
        const drinkId = card.querySelector('.flip-card-back').dataset.drinkId;

        const flipCardBack = card.querySelector('.flip-card-back');
        flipCardBack.addEventListener('mouseenter', () => {
            getDataDrinkById(drinkId);
        });
    });
    }
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar__menu');
    const menuLinks = document.querySelectorAll('.sidebar__menu a');

    const isMobileView = () => window.matchMedia('(max-width: 767px)').matches;

    menuLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (isMobileView()) {
                sidebar.classList.add('expanded-item');
                link.classList.add('active-hover');
            }
        });

        link.addEventListener('mouseleave', () => {
            if (isMobileView()) {
                sidebar.classList.remove('expanded-item');
                link.classList.remove('active-hover');
            }
        });

        link.addEventListener('touchstart', (e) => {
            if (isMobileView()) {
                menuLinks.forEach(otherLink => {
                    if (otherLink !== link) {
                        otherLink.classList.remove('active-hover');
                    }
                });
                if (link.classList.contains('active-hover')) {
                    sidebar.classList.remove('expanded-item');
                    link.classList.remove('active-hover');
                } else {
                    sidebar.classList.add('expanded-item');
                    link.classList.add('active-hover');
                }
                e.stopPropagation();
            }
        });
    });

    document.addEventListener('touchstart', (e) => {
        if (isMobileView() && !sidebar.contains(e.target)) {
            sidebar.classList.remove('expanded-item');
            menuLinks.forEach(link => link.classList.remove('active-hover'));
        }
    });

    window.addEventListener('resize', () => {
        if (!isMobileView()) {
            sidebar.classList.remove('expanded-item');
            menuLinks.forEach(link => link.classList.remove('active-hover'));
        }
    });



});