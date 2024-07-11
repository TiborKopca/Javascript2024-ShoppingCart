// Variables
const carrito = document.querySelector("#carrito");
const listaCursos = document.querySelector("#lista-cursos");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
let articulosCarrito = [];

// Listeners
cargarEventListeners();

function cargarEventListeners() {
  // Dispara cuando se presiona "Agregar Carrito"
  listaCursos.addEventListener("click", agregarCurso);

  // Cuando se elimina un curso del carrito
  carrito.addEventListener("click", eliminarCurso);

  // Al Vaciar el carrito
  vaciarCarritoBtn.addEventListener("click", vaciarCarrito);

  //LOAD FROM LOCAL STORAGE
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    // console.log(articulosCarrito);
    carritoHTML();
  });
}

// Funciones
// Función que añade el curso al carrito
function agregarCurso(e) {
  e.preventDefault();
  // Delegation para agregar-carrito
  if (e.target.classList.contains("agregar-carrito")) {
    //select parent element of the clicked element to get information about the card and all the properties and subelements
    const curso = e.target.parentElement.parentElement;
    // Enviamos el curso seleccionado para tomar sus datos
    leerDatosCurso(curso);
  }
}

// Lee los datos del curso/producto
function leerDatosCurso(curso) {
  //ALL KEY DATA FROM THE CARD
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1, //starting quantity
  };
  //IF THE PRODUCT IS ALREADY IN THE CART, INCREASE THE QUANTITY
  if (articulosCarrito.some((curso) => curso.id === infoCurso.id)) {
    //creates new array with the product and the quantity increased
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        //return increased quantity of the product/course
        return curso;
      } else {
        //return quantity = 1 in the product/Not modified === NEVER HAPPENS
        return curso;
      }
    });
    //MODIFYING THE ARRAY BY ADDING THE NEW QUANTITY TO THE ORIGINAL ARRAY, COOL!!!
    //WE TOOK OUT BEFORE ALL THE DATA FROM 'articulosCarrito', modified them in 'cursos' and return it to the original array
    articulosCarrito = [...cursos];
    console.table(articulosCarrito);
  } else {
    //IF THE PRODUCT WAS NOT IN THE CART, ADD IT TO THE END OF THE ARRAY
    articulosCarrito = [...articulosCarrito, infoCurso];

    //HERE MULTIPLE VARIATIONS OF PRINTING THE ARRAY
    console.table(articulosCarrito);
    console.log("array articulosCarrito: %O", articulosCarrito); //array articulosCarrito: Array(1)
    console.log("array1", articulosCarrito); //array1 [{…}]
  }
  //PRINTING THE NEW DATA TO DOM
  carritoHTML();
}

//Elimina el curso del carrito en el DOM
//WHEN IN THE CART, WHEN THE 'X' BUTTON IS PRESSED
function eliminarCurso(e) {
  e.preventDefault();
  if (e.target.classList.contains("borrar-curso")) {
    // e.target.parentElement.parentElement.remove();
    const cursoId = e.target.getAttribute("data-id");

    // Eliminar del arreglo del carrito
    //FILTER - FILTERS THE ARRAY AND RETURN IS WRITTEN TO THE ORIGINAL ARRAY/Overwriting it without the filtered data(all data which is not the data we are searching) which is the same as removing the data
    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);

    //Update the DOM
    carritoHTML();
  }
}

//Muestra el curso seleccionado en el Carrito
//GENERATES THE TABLE OF THE SELECTED PRODUCTS
function carritoHTML() {
  vaciarCarrito(); //need to clear before we paste data from the array

  //Takes all the products from the array
  articulosCarrito.forEach((curso) => {
    const row = document.createElement("tr");
    row.innerHTML = `
               <td>  
                    <img src="${curso.imagen}" width=100>
               </td>
               <td>${curso.titulo}</td>
               <td>${curso.precio}</td>
               <td>${curso.cantidad} </td>
               <td>
                    <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
               </td>
          `;
    contenedorCarrito.appendChild(row);
  });
  //Sync with local storage
  synchLocalStorage();
}

//SYNC WITH LOCAL STORAGE
function synchLocalStorage() {
localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

// Elimina los cursos del carrito en el DOM
function vaciarCarrito() {
  // forma lenta
  // contenedorCarrito.innerHTML = '';

  // forma rapida (recomendada)
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}
