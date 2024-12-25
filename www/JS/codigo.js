const baseURL = 'https://babytracker.develotion.com/';
let hayUsuarioLogueado = false;
const menu = document.querySelector("#menu");
const ruteo = document.querySelector("#ruteo");
let Categorias = [];


/*Inicio*/
Inicio();
function Inicio() {
  OcultarSecciones();
  AgregarEventos();
  PoblarSelectDeptos();
  //ArmarMenu();
  CategoriaImagen();

  if (localStorage.getItem("token") == null || localStorage.getItem("token") == "") {
    document.querySelector("#cerrarSesion").style.display = "none";
    document.querySelector("#menuRegistroEvento").style.display = "none";
    document.querySelector("#menuListadoEvento").style.display = "none";
    document.querySelector("#menuInformeEvento").style.display = "none";
    document.querySelector("#menuMapa").style.display = "none";

    ruteo.push("/Login");
  }
  else {
    document.querySelector("#cerrarSesion").style.display = "inline";
    document.querySelector("#menuLogin").style.display = "none";
    document.querySelector("#menuRegistro").style.display = "none";
    document.querySelector("#menuRegistroEvento").style.display = "none";

  }
}
function cerrarMenu() {
  menu.close();
}

function OcultarSecciones() {
  let divs = document.querySelectorAll(".ion-page");
  console.log(divs);
  for (let i = 1; i < divs.length; i++) {
    divs[i].style.display = "none";
  }
}

function MostrarSeccion(evt) {
  console.log(evt);
  let ruta = evt.detail.to;
  OcultarSecciones();
  switch (ruta) {
    case "/Login":
      document.querySelector("#login").style.display = "block";
      break;
    case "/Registro":
      document.querySelector("#registro").style.display = "block";
      break;
    case "/CerrarSesion":
      document.querySelector("#cerrarSesion").style.display = "none";
      document.querySelector("#menuLogin").style.display = "inline";
      document.querySelector("#menuRegistro").style.display = "inline";
      cerrarSesion();
      ruteo.push("/Login");
      break;
    case "/registroEvento":
      document.querySelector("#pantalla-RegistrarEvento").style.display = "block";
      PoblarCategoria();
      break;
    case "/ListadoEventos":
      document.querySelector("#pantalla-eventos").style.display = "block";
      MostrarEventos();
      break;
      case "/Mapa":
        document.querySelector("#pantalla-Mapa").style.display = "block";
        MostrarEventos();
        break;
        case "/InformesEventos":
          document.querySelector("#pantalla-Informes").style.display = "block";
          MostrarEventos();
          break;

  }
}
function AgregarEventos() {
  document.querySelector("#btnLogin").addEventListener("click", IniciarSesion);
  document.querySelector("#btnRegistroUsuario").addEventListener("click", Registro);
  ruteo.addEventListener("ionRouteWillChange", MostrarSeccion);
  document.querySelector("#slcDepartamento").addEventListener('ionChange', poblarSelectCiudades)
  document.querySelector("#btnRegistrarEvento").addEventListener("click", TomarDatosRegistroEvento);

}



function cerrarSesion() {
  localStorage.clear();
  document.querySelector("#menuRegistroEvento").style.display = "none";
  document.querySelector("#menuListadoEvento").style.display = "none";
  document.querySelector("#menuInformeEvento").style.display = "none";
  document.querySelector("#menuMapa").style.display = "none";

}


function Volver() {
  ruteo.back();
}

function AltaPedido(id) {
  console.log(id);
}






/********Iniciar sesion*******/
function IniciarSesion() {
  try {
    let nombreUsuario = document.querySelector("#txtNombre").value;
    let password = document.querySelector("#txtPassword").value;
    if (nombreUsuario.trim().length == 0 || password.trim().length == 0) {
      throw new Error("Datos incorrectos");
    }
    let datosUsuario = {
      "usuario": nombreUsuario,
      "password": password
    };

    fetch(`${baseURL}login.php`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",

        },
        body: JSON.stringify(datosUsuario)
      }
    )
      .then(function (response) {
        return response.json().then(data => ({
          status: response.status,
          data: data
        }));
      })
      .then(function (result) {
        const { status, data } = result;
        console.log("Response data:", data); // Añadido para depuración

        if (status === 200 && !data.error) {
          OcultarSecciones();
          hayUsuarioLogueado = true;
          ruteo.push("/");
          document.querySelector("#cerrarSesion").style.display = "inline";
          document.querySelector("#txtNombre").value = "";
          document.querySelector("#txtPassword").value = "";
          document.querySelector("#menuLogin").style.display = "none";
          document.querySelector("#menuRegistro").style.display = "none";

          document.querySelector("#menuRegistroEvento").style.display = "inline";
          document.querySelector("#menuListadoEvento").style.display = "inline";
          document.querySelector("#menuInformeEvento").style.display = "inline";
          document.querySelector("#menuMapa").style.display = "inline";



          localStorage.setItem('token', data.apiKey);
          localStorage.setItem('iduser', data.id);

          console.log("funciona");
        } else {
          throw new Error("Token no recibido");
        }

      })
      .catch(function (error) {
        mostrarMensaje(error.message || "Error en la comunicación");
        console.error("Fetch error:", error);
      });

  } catch (Error) {
    mostrarMensaje(Error.message);
    console.log("catch", Error.message);
  }
}


function IniciarSesionConDatos(nombreUsuario, password) {
  let datosUsuario = {
    "usuario": nombreUsuario,
    "password": password
  };

  fetch(`${baseURL}login.php`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(datosUsuario)
    }
  )
  .then(function (response) {
    return response.json().then(data => ({
      status: response.status,
      data: data
    }));
  })
  .then(function (result) {
    const { status, data } = result;
    console.log("Response data:", data); // Añadido para depuración

    if (status === 200 && !data.error) {
      OcultarSecciones();
      hayUsuarioLogueado = true;
      ruteo.push("/");
      document.querySelector("#cerrarSesion").style.display = "inline";
      document.querySelector("#txtNombre").value = "";
      document.querySelector("#txtPassword").value = "";
      document.querySelector("#menuLogin").style.display = "none";


      document.querySelector("#menuRegistroEvento").style.display = "inline";
      document.querySelector("#menuListadoEvento").style.display = "inline";
      document.querySelector("#menuInformeEvento").style.display = "inline";
      document.querySelector("#menuMapa").style.display = "inline";


      localStorage.setItem('token', data.apiKey);
      localStorage.setItem('iduser', data.id);

      console.log("funciona");
    } else {
      mostrarMensaje("Token no recibido");
    }

  })
  .catch(function (error) {
    mostrarMensaje(error.message || "Error en la comunicación");
    console.error("Fetch error:", error);
  });
}


function mostrarMensaje(texto) {
  let toast = document.createElement("ion-toast");
  toast.message = texto;
  toast.duration = 2000;
  toast.position = "bottom";
  toast.present();
  document.body.appendChild(toast);
}


/********************************Registro*************************/

function Registro() {
  try {
    let UsuarioRegistro = document.querySelector("#txtUsuarioRegistro").value;
    let Departamento = document.querySelector("#slcDepartamento").value;
    let Ciudad = document.querySelector("#slcCiudad").value;
    let password = document.querySelector("#txtPasswordRegistro").value;
    let confPassword = document.querySelector("#txtConfPassword").value;

    ValidarDatos(UsuarioRegistro, Departamento, Ciudad, password, confPassword);

    let usuario = {
      "usuario": UsuarioRegistro,
      "password": password,
      "idDepartamento": Departamento,
      "idCiudad": Ciudad
    };
    fetch(`${baseURL}usuarios.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
      })
      .then(function (response) {
        return response.json().then(data => ({
          status: response.status,
          data: data
        }));
      })


      .then(function (result) {
        const { status, data } = result;
        console.log("Response data:", data); // Añadido para depuración

        if (status === 200 && !data.error) {

          mostrarMensaje("Registro exitoso");
          console.log("Funciona");
          IniciarSesionConDatos(UsuarioRegistro, password);
        }
        else {
          mostrarMensaje(data.error);
          console.log(" NO Funciona");
        }
      })
      .catch(function (error) {
        mostrarMensaje("Error en la comunicación");
      })

  } catch (Error) {
    mostrarMensaje(Error.message);
    console.log("Catch");
  }
}



function ValidarDatos(UsuarioRegistro, Departamento, Ciudad, password, confPassword) {
  if (UsuarioRegistro.trim().length == 0) {
    throw new Error("El nombre de usuario es obligatorio");
  }
  if (Departamento.trim().length == 0) {
    throw new Error("El departamento es obligatorio");
  }

  if (Ciudad.trim().length == 0) {
    throw new Error("La ciudad es obligatoria");
  }

  if (password.trim().length == 0) {
    throw new Error("La password es obligatoria");
  }
  if (password.trim() != confPassword.trim()) {
    throw new Error("La password y su confirmación no coinciden");
  }
}


function LimpiarCampos() {
  document.querySelector("#txtUsuarioRegistro").value = "";
  document.querySelector("#txtDepartamento").value = "";
  document.querySelector("#txtCiudad").value = "";
  document.querySelector("#txtPasswordRegistro").value = "";
  document.querySelector("#txtConfPassword").value = "";
}




/********* Departamento/ciudades************/

function PoblarSelectDeptos() {


  fetch(`${baseURL}departamentos.php`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },

  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);
    let cadena = ``;

    for (let d of data.departamentos) {
      cadena += `<ion-select-option value="${d.id}">${d.nombre}</ion-select-option>`
    }

    document.querySelector("#slcDepartamento").innerHTML = cadena;
  })
}




function poblarSelectCiudades(evt) {
  console.log(evt);
  let idDepto = evt.detail.value;

  fetch(`${baseURL}ciudades.php?idDepartamento=${idDepto}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },

  }).then(function (response) {

    return response.json();
  }).then(function (data) {

    console.log(data);
    let cadena = ``;

    for (let c of data.ciudades) {
      cadena += `<ion-select-option value="${c.id}">${c.nombre}</ion-select-option>`
    }

    document.querySelector("#slcCiudad").innerHTML = cadena;


  });

}


/*******************4) AGREAGAR UN EVENTO *****************/



function PoblarCategoria() {
  fetch(`${baseURL}categorias.php`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "apikey": localStorage.getItem('token'),
      "iduser": localStorage.getItem('iduser'),
    },
  })
    .then(function (response) {
      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(function (data) {
      console.log("Response data:", data); // Depuración

      // Verifica si data.categorias existe y es un array
      if (!data.categorias || !Array.isArray(data.categorias)) {
        throw new Error("La respuesta de la API no tiene la estructura esperada.");
      }

      let cadena = ``;
      for (let d of data.categorias) {
        cadena += `<ion-select-option value="${d.id}">${d.tipo}</ion-select-option>`;
      }
      document.querySelector("#slcCategoria").innerHTML = cadena;
    })
    .catch(function (error) {
      console.error("Fetch error:", error);
      mostrarMensaje(error.message || "Error en la comunicación");
    });
}

function TomarDatosRegistroEvento() {
  let categoria = document.querySelector("#slcCategoria").value;
  let fecha = document.querySelector("#fechaEvento").value;
  let detalle = document.querySelector("#txtDetalle").value;
  RegistrarEvento(categoria, fecha, detalle);
}

function RegistrarEvento(categoria, fecha, detalle) {

  let evento = new Object();
  evento.idCategoria = categoria;
  evento.idUsuario = localStorage.getItem('iduser');  
  evento.fecha = fecha;
  evento.detalle = detalle;
  // prenderLoading();
  fetch(`${baseURL}eventos.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': localStorage.getItem("token"),
      'iduser': localStorage.getItem('iduser')

    },
    body: JSON.stringify(evento)
  }).then(function (response) {
    console.log(response);
    return response.json();
  }).then(function (data) {
    //        apagarLoading();
    console.log(data);
    if (data.codigo == 200) {
      mostrarMensaje("Evento registrado con exito");
    } else {
      mostrarMensaje("Problemas en registro de evento");

    }

  })

}


/*****************5) Mostrar Evento*******************/

function CategoriaImagen() {
  let token = localStorage.getItem("token");

  let usuario = localStorage.getItem("iduser");

  fetch(`${baseURL}/categorias.php`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'apikey': token,
      'iduser': usuario
    }
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(function(data) {

      Categorias = data.categorias


    }
    )

}


function MostrarEventos() {
  let token = localStorage.getItem("token");
  let usuario = localStorage.getItem("iduser");

  fetch(`${baseURL}eventos.php?idUsuario=${usuario}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'apikey': token,
      'iduser': usuario
    }
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(function (data) {
      if (!data.eventos || !Array.isArray(data.eventos)) {
        throw new Error("La respuesta de la API no tiene la estructura esperada.");
      }

      let eventosHoy = '';
      let otrosEventos = '';
      let hoy = new Date().toDateString();

      for (let evento of data.eventos) {
        let categoria = Categorias.find(cat => cat.id == evento.idCategoria);
        if(categoria != null){
        let fechaEvento = new Date(evento.fecha).toDateString();
        let card = `<ion-card>
                          <img alt="Imagen del evento" src=" https://babytracker.develotion.com/imgs/${categoria.imagen}.png" />
                          <ion-card-header>
                              <ion-card-title>${evento.detalle}</ion-card-title>
                              <ion-card-subtitle>${new Date(evento.fecha).toLocaleString()}</ion-card-subtitle>
                          </ion-card-header>
                          <ion-button id="${evento.id}" onclick="EliminarEvento(${evento.id})">Eliminar</ion-button>

                      </ion-card>`;

        if (fechaEvento === hoy) {
          eventosHoy += card;
        } else {
          otrosEventos += card;
        }

        }
      
      }

      document.querySelector("#mostrarEventosHoy").innerHTML = eventosHoy;
      document.querySelector("#mostrarEventos").innerHTML = otrosEventos;

      GenerarInforme(data.eventos);


    })
    .catch(function (error) {
      console.error("Fetch error:", error);
      mostrarMensaje(error.message || "Error en la comunicación");
    });
}




/*Eliminar evento*/

function EliminarEvento(idEvento)
{
 let token = localStorage.getItem("token");
    let usuario = localStorage.getItem("iduser");


     fetch(`${baseURL}/eventos.php?idEvento=${idEvento}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': token,
        'iduser': usuario
      }
    })
        MostrarEventos();
}




/************************6) Informe de eventos*************************/


function GenerarInforme(eventos) {
  let hoy = new Date().toDateString();

  let totalBiberones = 0;
  let totalPañales = 0;
  let ultimoBiberon = null;
  let ultimoPañal = null;

  for (let evento of eventos) {
    let fechaEvento = new Date(evento.fecha).toDateString();

    if (fechaEvento === hoy) {
      if (evento.idCategoria == 35) {  
        totalBiberones++;
        ultimoBiberon = evento.fecha;
      } else if (evento.idCategoria == 33) {  
        totalPañales++;
        ultimoPañal = evento.fecha;
      }
    }
  }

  document.querySelector("#msgBiberonesDia").innerText = totalBiberones;
  document.querySelector("#msgPañalesDia").innerText = totalPañales;

  if (ultimoBiberon) {
    let tiempoBiberonMs = new Date() - new Date(ultimoBiberon); 
    let horasBiberon = Math.floor(tiempoBiberonMs / (1000 * 60 * 60)); 
    let minutosBiberon = Math.floor((tiempoBiberonMs % (1000 * 60 * 60)) / (1000 * 60)); 
    document.querySelector("#msgTiempoBiberon").innerText = `${horasBiberon} horas y ${minutosBiberon} minutos`;
  }

  if (ultimoPañal) {
    let tiempoPañalMs = new Date() - new Date(ultimoPañal); 
    let horasPañal = Math.floor(tiempoPañalMs / (1000 * 60 * 60)); 
    let minutosPañal = Math.floor((tiempoPañalMs % (1000 * 60 * 60)) / (1000 * 60)); 
    document.querySelector("#msgTiempoPañal").innerText = `${horasPañal} horas y ${minutosPañal} minutos`;
  }

}






/************************7) Mapa ***********************/


let latitud;
let longitud;


 

navigator.geolocation.getCurrentPosition(guardarUbicacion, mostrarError);

function guardarUbicacion(position) {
    latitud = position.coords.latitude;
    longitud = position.coords.longitude;
    mostrarMapa();
}

function CargarCines(){
 cines.push(lonUniversitario);
 cines.push(latUniversitario);
}



function mostrarError(error){
    console.log(error);
}





async function ObtenerPlazas() {
  let token = localStorage.getItem("token");
  let usuario = localStorage.getItem("iduser");

  try {
      const response = await fetch(`${baseURL}plazas.php`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'apikey': token,
              'iduser': usuario
          },
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      return data;
  } catch (error) {
      console.error('Error fetching plazas:', error);
      return { plazas: [] }; // Devuelve un objeto vacÃo en caso de error
  }
}



function ObtenerUbicacion(pos) {
  console.log(pos.coords.latitude);
  console.log(pos.coords.longitude);
  lat = pos.coords.latitude;
  lon = pos.coords.longitude;
  mostrarMapa();
}



async function mostrarMapa() {
  var map = L.map('mapa').setView([latitud, longitud], 13);
  
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);


  let plazas = await ObtenerPlazas(); // Espera a que ObtenerPlazas se resuelva

  for (let plaza of plazas.plazas) {
    var marker =  L.marker([plaza.latitud, plaza.longitud]).addTo(map)

          if (plaza.aceptaMascotas == 1) {
            marker.bindPopup("Acepta mascotas").openPopup();
          }else if(plaza.aceptaMascotas == 0){
            marker.bindPopup("NO acepta mascotas").openPopup();

          }


          
  }


}

