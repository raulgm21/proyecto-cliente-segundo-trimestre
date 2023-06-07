//**************************************************************************************************************//
//**************************************************************************************************************//
//------------------------------------------------ MANEJADOR EVENTOS -------------------------------------------//
//**************************************************************************************************************//
//**************************************************************************************************************//  

    window.onload = function (){

        document.getElementById("enviar").addEventListener("click",login);

        document.getElementsByClassName("boton_amonestacion")[0].addEventListener("click",amonestacion);
        document.getElementsByClassName("boton_amonestacion")[1].addEventListener("click",amonestacion);
        document.getElementsByClassName("boton_expulsion")[0].addEventListener("click",expulsion_calle);
        document.getElementsByClassName("boton_expulsion")[1].addEventListener("click",expulsion_calle);
        document.getElementsByClassName("boton_firma")[0].addEventListener("click",pendiente_firma);
        document.getElementsByClassName("boton_firma")[1].addEventListener("click",pendiente_firma); 
        document.getElementsByClassName("boton_sancion_directa")[0].addEventListener("click",sancion_directa);
        document.getElementsByClassName("boton_sancion_directa")[1].addEventListener("click",sancion_directa);
        document.getElementsByClassName("boton_sancion_acumulada")[0].addEventListener("click",sancion_acumulativa);
        document.getElementsByClassName("boton_sancion_acumulada")[1].addEventListener("click",sancion_acumulativa);
        document.getElementsByClassName("boton_listado")[0].addEventListener("click",listado);
        document.getElementsByClassName("boton_listado")[1].addEventListener("click",listado);

    }

//**************************************************************************************************************//
//---------------------------------------------------- EXTRAS --------------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // La función consiste en refrescar la ventana principal para que así poder albergar nueva información.
        // -------------------------------------------------------------------------------------------------- //
    
            function refrescar(padre){
                while(padre.firstChild){                                                                 
                    padre.removeChild(padre.firstChild);
                    padre.style.height = "700px";            
                }
            }

        // -------------------------------------------------------------------------------------------------- //
        // La función consiste en un tiempo de carga que se da a la hora de mandar el correo.
        // -------------------------------------------------------------------------------------------------- //

            function cargar(){
                let padre = document.getElementById("contenedor");
                refrescar(padre);
               
                let titulo = document.createElement("h1");
                    titulo.setAttribute("class","titulo_contenedor");
                    titulo.innerHTML = "Se está enviando el correo, espere.";
                    padre.appendChild(titulo);
    
                let cargar = document.getElementById("cargar");
                    cargar.style.display = 'block';
    
            }

//**************************************************************************************************************//
//------------------------------------------------ INICAR SESIÓN -----------------------------------------------//
//**************************************************************************************************************//
      
        // -------------------------------------------------------------------------------------------------- //
        // La función consiste básicamente en un inicio de sesión que recogerá los valores de los inputs, si
        // son correctos iniciará sesión, sino, dará error.                                                   //
        // -------------------------------------------------------------------------------------------------- //

            function login(){

                // Creamos el Objeto
                USUARIO = {
                    codigo   : document.getElementById("codigo").value,
                    clave    : document.getElementById("clave").value,
                }
           
                // --- Realizamos Petición Asíncrona con Fetch para: Crear Falta
                fetch('php/login.php',{
                    method : 'POST',
                    body   : JSON.stringify(USUARIO),
                })

                // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                .then (respuesta => respuesta.json())

                // --- Manipulamos el JSON con el JavaScript
                .then ((respuestaJSON) => {
                
                        // Hemos accedido con un codigo y contraseña correcto
                        if(respuestaJSON == "correcto"){
                            let respuesta = document.getElementById("respuesta");
                            respuesta.innerHTML = "¡Estableciendo conexión!";
                            respuesta.style.position = 'absolute';
                            respuesta.style.top      = "42%";
                            respuesta.style.left     = "36%";

                            let cargar = document.getElementById("cargar");
                            cargar.style.display = 'block';

                            let cuerpo = document.querySelector("body");
                            cuerpo.style.background = "rgb(18 18 18)";

                            let formulario = document.getElementById("login");
                            formulario.style.display = 'none';

                            setTimeout(acceder_home,2000);

                        }else{
                            let respuesta = document.getElementById("respuesta");
                            respuesta.innerHTML = respuestaJSON;
                        }
                
                })

                // En caso de error en la Petición con Fetch
                .catch (() => {
                    console.log("@Fetch : Error en Login ")
                }) 

                // Después de 2 segundos nos llevará a home.php
                function acceder_home(){window.location.href = "home.php";}

            }

//**************************************************************************************************************//
//------------------------------------------------ AMONESTACIÓN ------------------------------------------------//
//**************************************************************************************************************//
     
        // ---[PUNTO 1]-------------------------------------------------------------------------------------- //
        // La función en conjunto realiza una AMONESTACIÓN siguiendo los siguientes pasos:                    //
        //                                                                                                    //
        //      --> Nivel Educativo             (con la función: mostrar_nivel)                               //
        //      --> Grupo                       (con la funciones: mostrar_grupo y crear_grupo)               //
        //      --> Alumnos                     (con la función: mostrar_alumno)                              //
        //      --> Asignaturas                 (con la función: mostrar_asignaturas)                         //
        //      --> Causa de la Amonestación | Crear una nueva causa de Amonestación                          //
        //      --> Fecha de la Amonestación                                                                  //
        //      --> ¿Es una sanción directa?. ¡SOLO PARA JEFATURA! [PUNTO 4]                                  //
        //                                                                                                    //
        // -------------------------------------------------------------------------------------------------- //

        function amonestacion(){

            let padre = document.getElementById("contenedor");
            refrescar(padre); 
            

            // Creanos la variable tipo para modular de una manera efectiva las demás funciones.
            let tipo = "amonestacion";

            // ------------------------------ Texto de la Ventana ------------------------------ //

                let titulo = document.createElement("h1");
                titulo.setAttribute("class","titulo_contenedor");
                titulo.innerHTML = "Amonestación";

                let parrafo = document.createElement("p");
                parrafo.setAttribute("class","parrafo_contenedor");
                parrafo.innerHTML = "Seleccione el Nivel Educativo porfavor:";

                padre.appendChild(titulo);
                padre.appendChild(parrafo);
            
            // ------------------------------------------------------------------------------- //

            // Ejecuta la función que consiste en: Mostrar los NIVELES EDUCATIVOS de la BDD
                mostrar_nivel(tipo); 

        }

//**************************************************************************************************************//
//---------------------------------------------- EXPULSIÓN CALLE -----------------------------------------------//
//**************************************************************************************************************//
      
        // ---[PUNTO 2]-------------------------------------------------------------------------------------- //
        // La función en conjunto realiza una EXPULSIÓN DE CALLE siguiendo los siguientes pasos:              //
        //                                                                                                    //
        //      --> Nivel Educativo            (con la función: mostrar_nivel)                                //
        //      --> Grupo                      (con la funciones: mostrar_grupo y crear_grupo)                //
        //      --> Alumnos                    (con la función: mostrar_alumno)                               //
        //      --> Asignaturas                (con la función: mostrar_asignaturas)                          //
        //      --> Causa de la Expulsión | Crear una nueva causa de Expulsión                                //
        //      --> Fecha de la Expulsión de Calle                                                            //
        //                                                                                                    //
        // -------------------------------------------------------------------------------------------------- //

        function expulsion_calle(){

            let padre = document.getElementById("contenedor");
            refrescar(padre); 
            padre.style.height = "500%";

            // Creanos la variable tipo para modular de una manera efectiva las demás funciones.
            let tipo = "expulsion calle";

            // ------------------------------ Texto de la Ventana ------------------------------ //

                let titulo = document.createElement("h1");
                titulo.setAttribute("class","titulo_contenedor");
                titulo.innerHTML = "Expulsión a la Calle";

                let parrafo = document.createElement("p");
                parrafo.setAttribute("class","parrafo_contenedor");
                parrafo.innerHTML = "Seleccione el Nivel Educativo porfavor:";

                padre.appendChild(titulo);
                padre.appendChild(parrafo);
            
            // ------------------------------------------------------------------------------- //

            // Ejecuta la función que consiste en: Mostrar los NIVELES EDUCATIVOS de la BDD
                mostrar_nivel(tipo);

        }

//**************************************************************************************************************//
//---------------------------------------------- MOSTRAR NIVEL ------------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // La función consiste en mostrar los diferentes NIVELES EDUCATIVOS existentes en la BDD. 
        // Esta función alberga la variable "tipo" para que sea modular con la AMOMESTACIÓN y EXPULSIÓN DE CALLE
        // -------------------------------------------------------------------------------------------------- //

        function mostrar_nivel(tipo){

            let padre = document.getElementById("contenedor");

            MOSTRAR = {
                mostrar : "mostrar_nivel_educativo",
            }

            // --- Realizamos Petición Asíncrona con Fetch para: Recibir los NIVELES EDUCATIVOS
            fetch('php/00_mostrar.php',{
                method : 'POST',
                body   : JSON.stringify(MOSTRAR),
            })

            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
            .then (respuesta => respuesta.json())

            // --- Manipulamos el JSON con el JavaScript
            .then ((respuestaJSON) => {

                // Este for nos creará un <p> con cada uno de los niveles educativos más un evento para cada uno de estos
                for(let i = 0 ; i < respuestaJSON.length ; i++){

                    // Creamos <p> con cada uno de los niveles educativos existentes en la BDD
                    var nombreNivel = document.createElement("p");
                    nombreNivel.innerHTML = respuestaJSON[i].nivel;
                    nombreNivel.setAttribute("id","parrafo_ventana"+i);
                    nombreNivel.style = "text-align : center; font-weight : bold; cursor : pointer;";
                    padre.appendChild(nombreNivel);

                    // Cada uno de los <p> cuentan con un EVENTO que nos permite seleccionar el NIVEL EDUCATIVO
                    document.getElementById("parrafo_ventana"+i).addEventListener('click', (event) => {
                        
                        let nivel_educa = document.getElementById("parrafo_ventana"+i).textContent;
                        // Ejecuta la función que consiste en: Mostrar los GRUPOS que disponga el NIVEL EDUCATIVO elegido
                        mostrar_grupos(tipo, nivel_educa);    

                    }, false);

                }

            })

            // En caso de error en la Petición con Fetch
            .catch (() => {
                console.log("@Fetch : Error en Nivel Educativo ")
            })

        }

//**************************************************************************************************************//
//----------------------------------------------- MOSTRAR GRUPOS -----------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // La función consiste en recoger el NIVEL EDUCATIVO clickeado anteriormente. Seguido de esto nos
        // mostará los GRUPOS de ese nivel educativo.
        // -------------------------------------------------------------------------------------------------- //

        function mostrar_grupos(tipo, nivel_edu){

            let padre = document.getElementById("contenedor");
            refrescar(padre);

            let titulo = document.createElement("h1");
            titulo.setAttribute("class","titulo_contenedor");
            titulo.innerHTML = nivel_edu;

            let parrafo = document.createElement("p");
            parrafo.setAttribute("class","parrafo_contenedor");
            parrafo.innerHTML = "Seleccione el Grupo porfavor:";

            padre.appendChild(titulo);
            padre.appendChild(parrafo);

            MOSTRAR = {
                mostrar : "mostrar_grupo",
                nivel   : nivel_edu
            }

            // --- Realizamos Petición Asíncrona con Fetch para: Recibir los NIVELES EDUCATIVOS
            fetch('php/00_mostrar.php',{
                method : 'POST',
                body   : JSON.stringify(MOSTRAR),
            })

            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
            .then (respuesta => respuesta.json())

            // --- Manipulamos el JSON con el JavaScript
            .then ((respuestaJSON) => {

                if(respuestaJSON != "no"){

                    // Este for nos creará un <p> con cada uno de los niveles educativos más un evento para cada uno de estos
                    for(let i = 0 ; i < respuestaJSON.length ; i++){

                        // Creamos <p> con cada uno de los niveles educativos existentes en la BDD
                        var nombreNivel = document.createElement("p");
                        nombreNivel.innerHTML = respuestaJSON[i].grupo;
                        nombreNivel.setAttribute("id","parrafo_ventana"+i);
                        nombreNivel.style = "text-align : center; font-weight : bold; cursor : pointer;";
                        padre.appendChild(nombreNivel);

                        // Cada uno de los <p> cuentan con un EVENTO que nos permite seleccionar el NIVEL EDUCATIVO
                        document.getElementById("parrafo_ventana"+i).addEventListener('click', (event) => {
                            
                            mostrar_alumnos(nivel_edu,respuestaJSON[i].grupo,tipo);

                        }, false);

                    }

                }else{
                    mostrar_alumnos(nivel_edu,"no",tipo);
                }

            })

            // En caso de error en la Petición con Fetch
            .catch (() => {
                console.log("@Fetch : Error en Nivel Educativo ")
            })
        }

//**************************************************************************************************************//
//----------------------------------------------- MOSTRAR ALUMNOS ----------------------------------------------//
//**************************************************************************************************************// 

        // -------------------------------------------------------------------------------------------------- //
        // La función consiste en mostrar a ALUMNOS del grupo (si tiene), del nivel educativo seleccionado.   //
        // Esta función tiene la variable "tipo" para que sea modular con la AMOMESTACIÓN y EXPULSIÓN DE CALLE//
        //                                                                                                    //
        // ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ Está función tiene 4 caminos dependiendo de la opción clickada ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ ⚠ //
        //      ---> Camino 1. PUNTO 3 [Pendientes de Firma]                                                  //
        //      ---> Camino 2. PUNTO 4 [Sanción Acumulada]                                                    //
        //      ---> Camino 3. PUNTO 4 [Sanción Directa]                                                      //
        //      ---> Camino 4. PUNTO 1 [Amonestación] y PUNTO 2 [Expulsión de Calle]                          //
        // -------------------------------------------------------------------------------------------------- //

        function mostrar_alumnos(nivel,grupo,tipo){

            let padre = document.getElementById("contenedor");
            refrescar(padre);

            // ------------------------------ Texto de la Ventana ------------------------------ //

            let titulo = document.createElement("h1");
            titulo.setAttribute("class","titulo_contenedor");

            // En caso de los CICLOS en la sección ALUMNOS solo mostrará el NIVEL, no como en la ESO o BACHILLER, que 
            // nos mostrará el NIVEL y GRUPO

            if(grupo == "no"){
                titulo.innerHTML = nivel; 
            }else{
                titulo.innerHTML = nivel + " " + grupo; 
            }

            padre.appendChild(titulo);
            
            let parrafo = document.createElement("p");
            parrafo.setAttribute("class","parrafo_contenedor");
            parrafo.innerHTML = "Los alumnos de este curso son:";
            padre.appendChild(parrafo);
            
            // ------------------------------------------------------------------------------- //

            // Declaración del objeto ALUMNOS, que nos lanzaremos en formato JSON permitiendo sacar los alumno
            // de ese nivel educativo y grupo, que hemos ido seleccionando anteriormente.

            ALUMNOS = {
                mostrar       : "mostrar_alumnos",
                alumnos_nivel : nivel,
                alumnos_grupo : grupo,
            }

            // --- Realizamos Petición Asíncrona con Fetch para: Recibir los ALUMNOS
            fetch('php/00_mostrar.php',{
                method : 'POST',
                body   : JSON.stringify(ALUMNOS),
            })

            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
            .then (respuesta => respuesta.json())

            // --- Manipulamos el JSON con el JavaScript
            .then ((respuestaJSON) => {

                if(respuestaJSON != "error"){

                    var contenedor_alumnos    = document.createElement("div");
                    contenedor_alumnos.setAttribute("class","contenedor_alumnos");
                    padre.appendChild(contenedor_alumnos);

                for(let i = 0 ; i < respuestaJSON.length ; i++){

                    // Creamos img con cada uno de los alumnos del curso
                    var imagenAlumno = document.createElement("img");
                    imagenAlumno.setAttribute("src",respuestaJSON[i].imagen);
                    imagenAlumno.setAttribute("id","icono_alumno"+i);
                    imagenAlumno.setAttribute("class","icono_alumno");
                    contenedor_alumnos.appendChild(imagenAlumno);

                    // Creamos <p> con cada uno de los niveles educativos existentes en la BDD
                    var alumnos_nombres = document.createElement("p");
                    alumnos_nombres.innerHTML = respuestaJSON[i].dni + " ~ " + respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos;
                    alumnos_nombres.setAttribute("id","parrafo_ventana"+i);
                    alumnos_nombres.style = "text-align : center; font-weight : bold; cursor : pointer; font-size : 24px;";
                    contenedor_alumnos.appendChild(alumnos_nombres);

                    // Cada uno de los <p> cuentan con un EVENTO que les permite seleccionar el contenido del <p>
                    document.getElementById("parrafo_ventana"+i).addEventListener('click', (event) => {
                            
                        // Si estamos en PENDIENTES DE FIRMA [PUNTO 3]
                        if(tipo == "firma"){    
                            let nombre_completo = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos;
                            mostrar_pendientes(respuestaJSON[i].dni, nombre_completo);

                        // Si estamos en AMONESTACIONES [PUNTO 1] o EXPULSIONES DE CALLE [PUNTO 2]   
                        }else{
                            let nombre_completo = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos;
                            // Mostramos las ASIGNATURAS que dispone en ALUMNO seleccionado
                            mostrar_asignaturas(tipo, respuestaJSON[i].dni, nombre_completo);
                        }

                    }, false);

                    // Cada uno de las img cuentan con un EVENTO que les permite seleccionar el contenido del <p>
                    document.getElementById("icono_alumno"+i).addEventListener('click', (event) => {
                            
                        // Si estamos en PENDIENTES DE FIRMA [PUNTO 3]
                        if(tipo == "firma"){    
                            let nombre_completo = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos;
                            mostrar_pendientes(respuestaJSON[i].dni, nombre_completo);

                        
                        }else{
                            // Si estamos en SANCIÓN ACUMULATIVA[PUNTO 4]
                            if(tipo == "sancion"){
                                let nombre_completo = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos;
                                mostrar_sancion(respuestaJSON[i].dni, nombre_completo);

                             
                            }else{ 
                                // Si estamos en SANCIÓN DIRECTA [PUNTO 4]
                                if(tipo == "sancion_directa"){
                                    crear_sancion_directa(respuestaJSON[i].dni);
                                    
                                }else{
                                    // Si estamos en AMONESTACIONES [PUNTO 1] o EXPULSIONES DE CALLE [PUNTO 2]
                                    let nombre_completo = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos;
                                    // Mostramos las ASIGNATURAS que dispone en ALUMNO seleccionado
                                    mostrar_asignaturas(tipo, respuestaJSON[i].dni, nombre_completo);
                                }
                               
                            }
     
                        }    

                    }, false);

                }

                // ⚠ En caso de que no exista el GRUPO (cambiando por inspeccionar), nos dirá que ese Curso no hay
                // ⚠ ningún alumno matriculado.
        
                }else{
                    var error = document.createElement("p");
                    error.innerHTML = "Ese curso NO tiene ningún alumno matriculado :(";
                    error.setAttribute("id","parrafo_ventana");
                    error.style = "text-align : center; font-weight : bold; cursor : pointer; font-size : 24px;";
                    padre.appendChild(error);
                }

            })

            // En caso de error en la Petición con Fetch
            .catch (() => {
                console.log("@Fetch : Error en Alumnos ")
            })

        }

//**************************************************************************************************************//
//--------------------------------------------- MOSTRAR ASIGNATURAS --------------------------------------------//
//**************************************************************************************************************// 

        // -------------------------------------------------------------------------------------------------- //
        // La función consiste en mostrar a las ASIGNATURAS del alumno seleccionado.
        // Esta función alberga la variable "tipo" para que sea modular con la AMOMESTACIÓN y EXPULSIÓN DE CALLE
        // -------------------------------------------------------------------------------------------------- //

        function mostrar_asignaturas(tipo, dni, nombre){

            let padre = document.getElementById("contenedor");
            refrescar(padre);

            // ------------------------------ Texto de la Ventana ------------------------------ //

            let titulo = document.createElement("h1");
            titulo.setAttribute("class","titulo_contenedor");
            titulo.innerHTML = "Las asignaturas de " + nombre + " son:";
            padre.appendChild(titulo);

            // -------------------------------------------------------------------------------- //

            // Declaración del objeto ALUMNOS, que nos lanzaremos en formato JSON permitiendo sacar las asignaturas
            // de ese ALUMNO, que hemos seleccionando anteriormente.

            ALUMNOS = {
                mostrar       : "mostrar_asignaturas",
                alumnos_dni   : dni,
            }

            // --- Realizamos Petición Asíncrona con Fetch para: Recibir los ALUMNOS
            fetch('php/00_mostrar.php',{
                method : 'POST',
                body   : JSON.stringify(ALUMNOS),
            })

            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
            .then (respuesta => respuesta.json())

            // --- Manipulamos el JSON con el JavaScript
            .then ((respuestaJSON) => {

                var contenedor_asignaturas    = document.createElement("div");
                contenedor_asignaturas.setAttribute("class","contenedor_asignaturas");
                padre.appendChild(contenedor_asignaturas);
                
                for(let i = 0 ; i < respuestaJSON.length ; i++){

                    var divAsi    = document.createElement("div");
                    divAsi.setAttribute("class","div_asignatura");

                    var nombreAsi = document.createElement("p");
                    nombreAsi.innerHTML = respuestaJSON[i].nombre;
                    nombreAsi.setAttribute("class","parrafo_asignatura"+i);

                    var imagenAsi = document.createElement("img");
                    imagenAsi.setAttribute("src",respuestaJSON[i].imagen);
                    imagenAsi.setAttribute("id","icono_asignatura"+i);
                    imagenAsi.setAttribute("class","icono_asignatura"+i);
                
                    contenedor_asignaturas.appendChild(divAsi);
                    
                    divAsi.appendChild(imagenAsi);
                    divAsi.appendChild(nombreAsi);
                    
                    // Cada uno de las asignaturas cuentan con un EVENTO que les permite poner la CAUSA

                    document.getElementById("icono_asignatura"+i).addEventListener('click', (event) => {
                            
                        let nombre_asignatura = respuestaJSON[i].nombre;
                        // Mostramos las ASIGNATURAS que dispone en ALUMNO seleccionado
                        mostrar_causas(tipo, dni, nombre_asignatura,nombre); 
                            
                    }, false);

                }

            })

            // En caso de error en la Petición con Fetch
            .catch (() => {
                console.log("@Fetch : Error en Asignaturas ")
            })

        }

//**************************************************************************************************************//
//---------------------------------------- MOSTRAR CAUSAS & CREAR CAUSAS ---------------------------------------//
//**************************************************************************************************************// 

        // -------------------------------------------------------------------------------------------------- //
        // La función consiste en mostrar las CAUSAS sea AMONESTACIÓN o EXPULSIÓN DE CALLE. Mostrará una lista 
        // con las causas existentes.
        //
        // Permite crear una causa nueva, y esta se guardará en la base de datos, y se establecerá automáticamente
        // en la amonestación/expulsión actual.
        //
        // La variable "tipo" que se ha ido arrastrando todo este tiempo, ahora nos permitirá distinguir las 
        // causas entre AMONESTACIÓN o EXPULSIÓN DE CALLE.
        // -------------------------------------------------------------------------------------------------- //

        function mostrar_causas(tipo, dni, asignatura, nombre){

            let padre = document.getElementById("contenedor");
            refrescar(padre);

            // ------------------------------ Texto de la Ventana ------------------------------ //

            let titulo = document.createElement("h1");
            titulo.setAttribute("class","titulo_contenedor");
            titulo.innerHTML = "Causa de la " + tipo + " para " + asignatura;
            padre.appendChild(titulo);
            
            let parrafo = document.createElement("p");
            parrafo.setAttribute("class","parrafo_contenedor");
            parrafo.innerHTML = "Las causas disponibles son las siguientes, no obstante si desea crear una nueva causa porfavor presione en 'Añadir nueva causa'";

            padre.appendChild(parrafo);

            // -------------------------------------------------------------------------------- //

            CAUSAS = {
                mostrar       : "mostrar_causas",
                causas_tipo   : tipo,
            }

            // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas
            fetch('php/00_mostrar.php',{
                method : 'POST',
                body   : JSON.stringify(CAUSAS),
            })
    
            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
            .then (respuesta => respuesta.json())
    
            // --- Manipulamos el JSON con el JavaScript
            .then ((respuestaJSON) => {
                
                // Este for nos creará un <p> con cada una de las causas
                for(let i = 0 ; i < respuestaJSON.length ; i++){

                    // Creamos <p> con cada una de las causas existentes en la BDD dependiendo del tipo
                    var textoCausa = document.createElement("p");
                    textoCausa.innerHTML = respuestaJSON[i].codigo + " - " + respuestaJSON[i].causa;
                    textoCausa.setAttribute("id","parrafo_ventana"+i);
                    textoCausa.style = "text-align : center; font-weight : bold; cursor : pointer;";
                    padre.appendChild(textoCausa);

                    // Cada uno de los <p> cuentan con un EVENTO que nos permite seleccionar la causa
                    document.getElementById("parrafo_ventana"+i).addEventListener('click', (event) => {
                        
                        let causa = respuestaJSON[i].codigo;
                        // Ejecuta la función que consiste en: Establecer la fecha para la falta.
                        mostrar_fecha(tipo, causa, dni, asignatura,nombre);    

                    }, false);

                }

            })
    
            // En caso de error en la Petición con Fetch
            .catch (() => {
                console.log("@Fetch : Error en Causas ")
            }) 

            let nueva_imagen = document.createElement("img");
            nueva_imagen.setAttribute("id","nueva_causa");
            nueva_imagen.src = "imagenes/nueva_causa.png";
            padre.appendChild(nueva_imagen);

            document.getElementById('nueva_causa').addEventListener("click",crear_causa);

            //*********************************************************************************************************//
            //---------------------------------------------- CREAR CAUSAS ---------------------------------------------//
            //*********************************************************************************************************//

                // ------------------------------------------------------------------------------------------------ //
                // La función consiste en crear una nueva causa dependiendo de si es amonestación o expulsión de calle.
                // Al crear una nueva causa, está nos dirigirá a mostrar fechas asignando al alumno la nueva causa.
                // Nos generará una ventana modal previamente.
                // ------------------------------------------------------------------------------------------------ //

                function crear_causa(){

                    // ----------------------- CREACIÓN DEL MODAL ----------------------- //
                    
                    let modal = document.createElement("dialog");
                    modal.setAttribute("id","modal_nueva_causa");
                    padre.appendChild(modal);

                    // ----------------------- CONTENIDO DEL MODAL ---------------------- // 

                    let titulo_modal = document.createElement("h1");
                    titulo_modal.innerHTML = "Insertar Nueva Causa";

                    let parrafo_modal = document.createElement("p");
                    parrafo_modal.innerHTML = "Escriba la nueva causa porfavor";

                    let formulario = document.createElement("form");
                    formulario.setAttribute("id","formulario_nueva_causa");

                    let input = document.createElement("textarea");
                    input.setAttribute("id","input_nueva_causa");
                    input.setAttribute("placeholder","Escriba la nueva causa: ");

                    let aceptar_modal = document.createElement("button");
                    aceptar_modal.setAttribute("id","aceptar_modal");
                    aceptar_modal.innerHTML = "Aceptar";

                    let atras_modal = document.createElement("button");
                    atras_modal.setAttribute("id","atras_modal");
                    atras_modal.innerHTML = "Atrás";

                    // ----------------------- INSERTAR EL MODAL ---------------------- //

                    modal.appendChild(titulo_modal);
                    modal.appendChild(parrafo_modal);
                    modal.appendChild(formulario);
                    formulario.appendChild(input);
                    modal.appendChild(aceptar_modal);
                    modal.appendChild(atras_modal);

                    // Abrimos el modal, y nos dará dos opciones. Enviar o Atras
                    window.modal_nueva_causa.showModal();

                    // --- ENVIAR ---> Enviamos la causa escrita a un fichero PHP que se encargará de insertar una nueva causa en la BDD.
                                    
                    document.getElementById("aceptar_modal").addEventListener('click', (event) => {  

                        // Declaramos el objeto para decir a servidor cual es el tipo (Amonestacion|Expulsion) y su causa
                        PETICION = {
                            mostrar           : "crear_causas",
                            peticion_tipo     : tipo,
                            peticion_causa    : input.value,
                        }

                        // --- Realizamos Petición Asíncrona con Fetch para: Crear las Causas
                        fetch('php/00_mostrar.php',{
                        method : 'POST',
                        body   : JSON.stringify(PETICION),
                        })
        
                        // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                        .then (respuesta => respuesta.json())
        
                        // --- Manipulamos el JSON con el JavaScript
                        .then ((respuestaJSON) => {

                            // La causa se ha creado bien, y nos dirigirá a mostrar_fecha
                            if(respuestaJSON != "vacio"){
                                mostrar_fecha(tipo, respuestaJSON, dni, asignatura);
                            }else{
                                // Surgió un error a la hora de establecer la causa.
                                alert("La causa no se ha establecido bien :(. Intentalo más tarde");
                                mostrar_causas(tipo, dni, asignatura);
                            }
                        })
        
                        // En caso de error en la Petición con Fetch
                        .catch (() => {
                            console.log("@Fetch : Error en Crear Causa ")
                        })
                        
                    }, false);

                    // --- ATRAS ---> Cerramos la ventana modal

                    document.getElementById("atras_modal").addEventListener('click', (event) => {  
                        window.modal_nueva_causa.close();
                        mostrar_causas(tipo, dni, asignatura);
                    }, false);

                }
        }

//**************************************************************************************************************//
//-------------------------------------------- CREAR MOTIVO SANCIÓN --------------------------------------------//
//**************************************************************************************************************//

        function crear_motivo_sancion(tipo,dni,nombre,cadena,causa,asignatura){

            let padre = document.getElementById("contenedor");
            // ----------------------- CREACIÓN DEL MODAL ----------------------- //

            let modal = document.createElement("dialog");
            modal.setAttribute("id","modal_nueva_causa");
            padre.appendChild(modal);
            
            // ----------------------- CONTENIDO DEL MODAL ---------------------- // 
            
            let titulo_modal = document.createElement("h1");
            titulo_modal.innerHTML = "Motivo Sancion";
            
            let parrafo_modal = document.createElement("p");
            parrafo_modal.innerHTML = "Escriba la nueva sancion porfavor";
            
            let formulario = document.createElement("form");
            formulario.setAttribute("id","formulario_nueva_causa");
            
            let input = document.createElement("textarea");
            input.setAttribute("id","input_nueva_causa");
            input.setAttribute("placeholder","Escriba la nueva causa: ");
            
            let aceptar_modal = document.createElement("button");
            aceptar_modal.setAttribute("id","aceptar_modal");
            aceptar_modal.innerHTML = "Aceptar";
            
            let atras_modal = document.createElement("button");
            atras_modal.setAttribute("id","atras_modal");
            atras_modal.innerHTML = "Atrás";
            
            // ----------------------- INSERTAR EL MODAL ---------------------- //
            
            modal.appendChild(titulo_modal);
            modal.appendChild(parrafo_modal);
            modal.appendChild(formulario);
            formulario.appendChild(input);
            modal.appendChild(aceptar_modal);
            modal.appendChild(atras_modal);
            
            // Abrimos el modal, y nos dará dos opciones. Enviar o Atras
            window.modal_nueva_causa.showModal();
            
            // --- ENVIAR ---> Enviamos la causa escrita a un fichero PHP que se encargará de insertar una nueva causa en la BDD.
                                                
            document.getElementById("aceptar_modal").addEventListener('click', (event) => {  
            
                // Declaramos el objeto para decir a servidor cual es el tipo (Amonestacion|Expulsion) y su causa
                PETICION = {
                    mostrar           : "crear_motivo_sancion",
                    peticion_tipo     : tipo,
                    peticion_causa    : input.value,
                }
            
                // --- Realizamos Petición Asíncrona con Fetch para: Crear las Causas
                fetch('php/00_mostrar.php',{
                    method : 'POST',
                    body   : JSON.stringify(PETICION),
                })
                    
                // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                .then (respuesta => respuesta.json())
                    
                // --- Manipulamos el JSON con el JavaScript
                .then ((respuestaJSON) => {
                    
                    if(tipo == "amonestacion"){
                        cargar.style = "none";
                        window.modal_nueva_causa.close();
                        mostrar_modal(tipo,dni,nombre,cadena,causa,asignatura);
                    }else{
                        window.modal_nueva_causa.close();
                        refrescar(padre);
                        mostrar_modal(tipo,dni,nombre,cadena,causa,asignatura);
                    }
                    
                })
                    
                // En caso de error en la Petición con Fetch
                .catch (() => {
                    console.log("@Fetch : Error en Crear Causa ")
                })
                                    
                }, false);
            
                // --- ATRAS ---> Cerramos la ventana modal
            
                document.getElementById("atras_modal").addEventListener('click', (event) => {  
                    window.modal_nueva_causa.close();
                    refrescar(padre);
                    mostrar_modal(tipo,dni,nombre,cadena,causa,asignatura);
                }, false);

        }

//**************************************************************************************************************//
//------------------------------------------ CREAR MEDIDA CORRECTORA -------------------------------------------//
//**************************************************************************************************************//

        function crear_medida_correctora(tipo,dni,nombre,cadena,causa,asignatura){

            let padre = document.getElementById("contenedor");
            let cargar = document.getElementById("cargar");
            // ----------------------- CREACIÓN DEL MODAL ----------------------- //

            let modal = document.createElement("dialog");
            modal.setAttribute("id","modal_nueva_causa");
            padre.appendChild(modal);
            
            // ----------------------- CONTENIDO DEL MODAL ---------------------- // 
            
            let titulo_modal = document.createElement("h1");
            titulo_modal.innerHTML = "Medida Correctoras";
            
            let parrafo_modal = document.createElement("p");
            parrafo_modal.innerHTML = "Escriba la medida correctora porfavor";
            
            let formulario = document.createElement("form");
            formulario.setAttribute("id","formulario_nueva_causa");
            
            let input = document.createElement("textarea");
            input.setAttribute("id","input_nueva_causa");
            input.setAttribute("placeholder","Escriba la nueva medida correctora: ");
            
            let aceptar_modal = document.createElement("button");
            aceptar_modal.setAttribute("id","aceptar_modal");
            aceptar_modal.innerHTML = "Aceptar";
            
            let atras_modal = document.createElement("button");
            atras_modal.setAttribute("id","atras_modal");
            atras_modal.innerHTML = "Atrás";
            
            // ----------------------- INSERTAR EL MODAL ---------------------- //
            
            modal.appendChild(titulo_modal);
            modal.appendChild(parrafo_modal);
            modal.appendChild(formulario);
            formulario.appendChild(input);
            modal.appendChild(aceptar_modal);
            modal.appendChild(atras_modal);
            
            // Abrimos el modal, y nos dará dos opciones. Enviar o Atras
            window.modal_nueva_causa.showModal();
            
            // --- ENVIAR ---> Enviamos la causa escrita a un fichero PHP que se encargará de insertar una nueva causa en la BDD.
                                                
            document.getElementById("aceptar_modal").addEventListener('click', (event) => {  
            
                // Declaramos el objeto para decir a servidor cual es el tipo (Amonestacion|Expulsion) y su causa
                PETICION = {
                    mostrar           : "crear_medida_correctora",
                    peticion_tipo     : tipo,
                    peticion_causa    : input.value,
                }
            
                // --- Realizamos Petición Asíncrona con Fetch para: Crear las Causas
                fetch('php/00_mostrar.php',{
                    method : 'POST',
                    body   : JSON.stringify(PETICION),
                })
                    
                // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                .then (respuesta => respuesta.json())
                    
                // --- Manipulamos el JSON con el JavaScript
                .then ((respuestaJSON) => {
                    
                    if(tipo == "amonestacion"){
                        cargar.style = "none";
                        window.modal_nueva_causa.close();
                        refrescar(padre);
                        mostrar_modal(tipo,dni,nombre,cadena,causa,asignatura);
                    }else{
                        window.modal_nueva_causa.close();
                        refrescar(padre);
                        mostrar_modal(tipo,dni,nombre,cadena,causa,asignatura);
                    }
                    
                })
                    
                // En caso de error en la Petición con Fetch
                .catch (() => {
                    console.log("@Fetch : Error en Crear Causa ")
                })
                                    
                }, false);
            
                // --- ATRAS ---> Cerramos la ventana modal
            
                document.getElementById("atras_modal").addEventListener('click', (event) => {  
                    window.modal_nueva_causa.close();
                    refrescar(padre);
                    mostrar_modal(tipo,dni,nombre,cadena,causa,asignatura);
                }, false);

        }

//**************************************************************************************************************//
//------------------------------------- MOSTRAR FECHA & IMPLEMENTAR FALTA --------------------------------------//
//**************************************************************************************************************// 

        // -------------------------------------------------------------------------------------------------- //
        // La función primeramente nos mostrará un resumen de la AMONESTACIÓN/EXPULSIÓN. Seguido de esto nos 
        // pedirá que pongamos una fecha a la falta, con máximo hoy (valor por defecto).
        // Finalmente al darle a la imagen, nos llevará a la función implementar.
        //
        // En caso de estar en un perfil de JEFATURA, nos saldrá una segunda imagen para realizar una sanción directa.
        // -------------------------------------------------------------------------------------------------- //

        function mostrar_fecha(tipo, causa, dni, asignatura,nombre){
            
            let padre = document.getElementById("contenedor");
            refrescar(padre);

            // ------------------------------ Texto de la Ventana ------------------------------ //

            let titulo = document.createElement("h1");
            titulo.setAttribute("class","titulo_contenedor");
            titulo.innerHTML = "Resumen de la Falta";
            padre.appendChild(titulo);
            
            let parrafo = document.createElement("p");
            parrafo.setAttribute("class","parrafo_contenedor");
            parrafo.innerHTML = "Aquí tiene un resumen, selecciona una fecha para establecer la falta";
            padre.appendChild(parrafo);

            // Declaración del objeto resumen, donde nos interesan X valores de las variables recibidas.
            RESUMEN = {
                mostrar            : "mostrar_resumen",
                resumen_tipo       : tipo,
                resumen_codigo     : causa,
                resumen_dni        : dni,
                resumen_asignatura : asignatura,
            }

            // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas
            fetch('php/00_mostrar.php',{
                method : 'POST',
                body   : JSON.stringify(RESUMEN),
            })
    
            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
            .then (respuesta => respuesta.json())
    
            // --- Manipulamos el JSON con el JavaScript
            .then ((respuestaJSON) => {
                
                // ------------------------------ Texto de la Ventana - Resumen ------------------------------ //
                let nombre_parrafo = document.createElement("p");
                nombre_parrafo.innerHTML = "El alumn@ es: " + respuestaJSON.nombre + " " + respuestaJSON.apellidos;
                nombre_parrafo.setAttribute("id","texto_resumen");
                padre.appendChild(nombre_parrafo);

                let motivo_parrafo = document.createElement("p");
                motivo_parrafo.innerHTML = "El motivo de la " + tipo + " es: " + respuestaJSON.motivo;
                motivo_parrafo.setAttribute("id","texto_resumen");
                padre.appendChild(motivo_parrafo);

                let asignatura_parrafo = document.createElement("p");
                asignatura_parrafo.innerHTML = "La asignatura es: " +respuestaJSON.asignatura;
                asignatura_parrafo.setAttribute("id","texto_resumen");
                padre.appendChild(asignatura_parrafo);
                
                // Establecer el input date con la fecha actual, y limitando dias futuros.

                let fecha_actual = new Date();

                let fecha = document.createElement("input");
                fecha.setAttribute("type","date");
                fecha.setAttribute("id","fecha_actual");
                fecha.setAttribute("max",fecha_actual.toJSON().slice(0,10)) // Establece máximo hoy
                padre.appendChild(fecha);

                document.getElementById("fecha_actual").value = fecha_actual.toJSON().slice(0,10); // Establece el día de hoy

                let parrafo = document.createElement("p");
                parrafo.setAttribute("class","parrafo_contenedor");
                parrafo.innerHTML = "Por defecto la fecha se asigna a la de hoy, puedes cambiarla :)";
                padre.appendChild(parrafo);

                //--------------------------------------------------------------------------------//
                // Saber el rol del usuario
                let rol = document.getElementById("rol").value;

                if(rol == "JEFA" && tipo == "amonestacion"){
                    let enviar = document.createElement("img");
                    enviar.setAttribute("id","aceptar_falta");
                    enviar.src = "imagenes/falta.png";
                    enviar.style.left = "25%";
                    padre.appendChild(enviar);

                    let sancionDirecta = document.createElement("img");
                    sancionDirecta.setAttribute("id","sancion_directa");
                    sancionDirecta.src = "imagenes/directa.png";
                    sancionDirecta.style.left = "25%";
                    padre.appendChild(sancionDirecta);

                    // Ejecuta la función que nos implementa la falta en conjunto a todos los pasos anteriores.
                    document.getElementById("aceptar_falta").addEventListener('click', (event) => {
                        implementar_falta(fecha.value,tipo);
                        cargar();
                    }, false);

                    // Ejecuta la función que nos implementa la falta como SANCIÓN DIRECTA [PUNTO 4].
                    document.getElementById("sancion_directa").addEventListener('click', (event) => {

                        crear_sancion_amonestacion(dni,causa,asignatura);
                        cargar();

                    }, false);

                }else{

                    let enviar = document.createElement("img");
                    enviar.setAttribute("id","aceptar_falta");
                    enviar.src = "imagenes/falta.png";
                    padre.appendChild(enviar);

                    // Ejecuta la función que nos implementa la falta en conjunto a todos los pasos anteriores.
                    document.getElementById("aceptar_falta").addEventListener('click', (event) => {

                        implementar_falta(fecha.value,tipo);
                        cargar();

                    }, false);
                }

            })
    
            // En caso de error en la Petición con Fetch
            .catch (() => {
                console.log("@Fetch : Error en Resumen ")
            }) 

            //*********************************************************************************************************//
            //------------------------------------------- IMPLEMENTAR FALTA -------------------------------------------//
            //*********************************************************************************************************//

                // -------------------------------------------------------------------------------------------------- //
                // La función su función final mediante el uso de las anteriores funciones, insertar la Amonestación o
                // expulsión en la base de datos control_faltas.
                // -------------------------------------------------------------------------------------------------- //

                function implementar_falta(fecha,tipo){

                    // Declarar el objeto

                    FALTA = {
                        falta_causa      : causa,
                        falta_asignatura : asignatura,
                        falta_dni        : dni,
                        falta_fecha      : fecha,
                        falta_tipo       : tipo,
                    }

                    // --- Realizamos Petición Asíncrona con Fetch para: Crear Falta
                    fetch('php/01_02_crearfalta.php',{
                        method : 'POST',
                        body   : JSON.stringify(FALTA),
                    })
            
                    // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                    .then (respuesta => respuesta.json())
            
                    // --- Manipulamos el JSON con el JavaScript
                    .then ((respuestaJSON) => {})

                    // En caso de error en la Petición con Fetch
                    .catch (() => {
                        
                            // ------------------------------ Texto de la Ventana ------------------------------ //
                            
                            let cargar = document.getElementById("cargar");
                            cargar.style.display = 'none';

                            refrescar(padre);
                            let titulo = document.createElement("h1");
                            titulo.setAttribute("class","titulo_contenedor");
                            titulo.innerHTML = "La " + tipo + " se realizó correctamente" ;

                            let parrafo = document.createElement("p");
                            parrafo.setAttribute("class","parrafo_contenedor");
                            parrafo.innerHTML = "Esperemos que la instancia haya ido bien :)";

                            padre.appendChild(titulo);
                            padre.appendChild(parrafo);
            
                        // ------------------------------------------------------------------------------- //


                    }) 
                }

        }

//**************************************************************************************************************//
//-------------------------------------------- PENDIENTES FIRMA ------------------------------------------------//
//**************************************************************************************************************// 

        // ---[PUNTO 3]-------------------------------------------------------------------------------------- //
        // La función sigue el siguiente flujo:                                                               //
        //                                                                                                    //
        //      --> Nivel Educativo             (con la función: mostrar_nivel)                               //
        //      --> Grupo                       (con la funciones: mostrar_grupo y crear_grupo)               //
        //      --> Alumnos                     (con la función: mostrar_alumno)                              //
        //                                                                                                    //
        // En conclusión al acceder en un alumno mostrará si tiene amonestaciones o expulsiones pendientes    //
        // -------------------------------------------------------------------------------------------------- //

        function pendiente_firma(){

            let padre = document.getElementById("contenedor");
            refrescar(padre); 
            padre.style.height = "500%";

            // Saber el rol del usuario
            let rol = document.getElementById("rol").value;

            // Si el usuario es de Jefatura de Estudios
            if(rol == "JEFA"){

                let tipo  = "firma";
                // ------------------------------ Texto de la Ventana ------------------------------ //

                    let titulo = document.createElement("h1");
                    titulo.setAttribute("class","titulo_contenedor");
                    titulo.innerHTML = "Pendiente de Firma";

                    let parrafo = document.createElement("p");
                    parrafo.setAttribute("class","parrafo_contenedor");
                    parrafo.innerHTML = "Seleccione el Nivel Educativo porfavor:";

                    padre.appendChild(titulo);
                    padre.appendChild(parrafo);
                
                // ------------------------------------------------------------------------------- //

                // Ejecuta la función que consiste en: Mostrar los NIVELES EDUCATIVOS de la BDD
                    mostrar_nivel(tipo); 

            // Si el usuario es un profesor
            }else{
                    let titulo = document.createElement("h1");
                    titulo.setAttribute("class","titulo_contenedor");
                    titulo.innerHTML = "⚠ Solo puede acceder Jefatura de Estudios ⚠";
                    padre.appendChild(titulo);
                    
            }
        }

        // ---[PUNTO 3]-------------------------------------------------------------------------------------- //
        // La función nos mostrará las amonestaciones o expusiones sin firma del alumno seleccionado          //
        // -------------------------------------------------------------------------------------------------- //

        function mostrar_pendientes(dni, nombre){

            let padre = document.getElementById("contenedor");
            refrescar(padre);

            // ------------------------------ Texto de la Ventana ------------------------------ //

            let titulo = document.createElement("h1");
            titulo.setAttribute("class","titulo_contenedor");
            titulo.innerHTML = "Las pendientes de firma de " + nombre + " son:";
            padre.appendChild(titulo);
            
            // -------------------------------------------------------------------------------- //

            // Declaración del objeto ALUMNOS, que nos lanzaremos en formato JSON permitiendo sacar las asignaturas
            // de ese ALUMNO, que hemos seleccionando anteriormente.

            ALUMNOS = {
                tipo_pendiente : "mostrar_pendientes",
                alumnos_dni    : dni,
            }

            // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas
            fetch('php/03_pendientes_firma.php',{
                method : 'POST',
                body   : JSON.stringify(ALUMNOS),
            })
    
            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
            .then (respuesta => respuesta.json())
    
            // --- Manipulamos el JSON con el JavaScript
            .then ((respuestaJSON) => {
                
                // El alumno no tiene ninguna amonestacion o expulsion sin firmar
                if(respuestaJSON == 0){
                   
                    let parrafo = document.createElement("p");
                    parrafo.setAttribute("class","parrafo_contenedor2");
                    parrafo.innerHTML = "El alumno no tiene ninguna amonestación o expulsión pendiente de firmar";
                    padre.appendChild(parrafo);

                // El alumno tiene una o varias amonestaciones o expulsiones sin firmar.
                }else{
                    
                    
                    for(let i = 0 ; i < respuestaJSON.length ; i++){

                        var falta = document.createElement("p");
                        falta.setAttribute("class","parrafo_contenedor2");
                        
                        falta.innerHTML = "La causa es " + respuestaJSON[i].causa + " en la asignatura " + respuestaJSON[i].asignatura + ", el día: " +respuestaJSON[i].fecha;
                        padre.appendChild(falta);
    
                        var radio = document.createElement("input");
                        radio.setAttribute("type","radio");
                        radio.setAttribute("id","amonestacion"+i);
                        falta.appendChild(radio);

                    }

                    let firmar = document.createElement("button");
                    firmar.setAttribute("id","enviar_sancion");
                    firmar.innerHTML = "Enviar";
                    firmar.style.position = "relative";
                    firmar.style.top = "48px";
                    padre.appendChild(firmar);

                        // Al presionar ENVIAR
                        document.getElementById("enviar_sancion").addEventListener('click', (event) => {  
                        
                            // Se gurdará el valor de los check en un array
                            var cadena = [];
                                            
                            for(let i = 0 ; i < respuestaJSON.length ; i++){
                    
                                let radio_check = document.getElementById("amonestacion"+i).checked;
                        
                                    if(radio_check == true){
                                                    
                                            cadena[i] = true;
                    
                                        }else{
                                            cadena[i] = false;
                                        }
                        
                            }
                            console.log(cadena);
                            ALUMNOS = {
                                tipo_pendiente : "firmar_pendientes",
                                alumnos_dni    : dni,
                                alumnos_firmar : cadena
                            }
                            // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas
                            fetch('php/03_pendientes_firma.php',{
                                method : 'POST',
                                body   : JSON.stringify(ALUMNOS),
                            })
            
                            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                            .then (respuesta => respuesta.json())
            
                            // --- Manipulamos el JSON con el JavaScript
                            .then ((respuestaJSON) => {
                        
                             if(respuestaJSON == "correcto"){

                            // ------------------------------ Texto de la Ventana ------------------------------ //

                                refrescar(padre);
                                let titulo = document.createElement("h1");
                                titulo.setAttribute("class","titulo_contenedor");
                                titulo.innerHTML = "Se han firmado con éxito" ;

                                let parrafo = document.createElement("p");
                                parrafo.setAttribute("class","parrafo_contenedor");
                                parrafo.innerHTML = "Esperemos que la instancia haya ido bien :)";

                                padre.appendChild(titulo);
                                padre.appendChild(parrafo);
            
                            // ------------------------------------------------------------------------------- //

                            }else{
                                if(respuestaJSON == "todoFalse"){
                                    alert("Debes de seleccionar al menos una amonestación o expulsión");
                                    mostrar_pendientes(dni, nombre);
                                }else{
                                    alert("Ha ocurrido un error a la hora de firmar. Intentelo de nuevo");
                                    refrescar(padre);
                                }

                            }

                            })
            
                            // En caso de error en la Petición con Fetch
                            .catch (() => {
                                console.log("@Fetch : Error en Crear Sancion ")
                            })
                    
                        }, false);

                }

            })
    
            // En caso de error en la Petición con Fetch
            .catch (() => {
                console.log("@Fetch : Error en Mostrar Pendientes ")
            }) 

        }

//**************************************************************************************************************//
//---------------------------------------------------- SANCIÓN -------------------------------------------------//
//**************************************************************************************************************//
             
        // ---[PUNTO 4]-------------------------------------------------------------------------------------- //
        // La función sigue el siguiente flujo:                                                               //
        //                                                                                                    //
        //      --> Nivel Educativo             (con la función: mostrar_nivel)                               //
        //      --> Grupo                       (con la funciones: mostrar_grupo y crear_grupo)               //
        //      --> Alumnos                     (con la función: mostrar_alumno)                              //
        //                                                                                                    //
        // En conclusión al acceder en un alumno mostrará las amonestaciones que dispone el alumno sin sanción//
        // -------------------------------------------------------------------------------------------------- //

        function sancion_acumulativa(){
            
            let padre = document.getElementById("contenedor");
            refrescar(padre); 
            padre.style.height = "500%";

            // Saber el rol del usuario
            let rol = document.getElementById("rol").value;

            // Si el usuario es de Jefatura de Estudios
            if(rol == "JEFA"){

                let tipo  = "sancion";
                // ------------------------------ Texto de la Ventana ------------------------------ //

                    let titulo = document.createElement("h1");
                    titulo.setAttribute("class","titulo_contenedor");
                    titulo.innerHTML = "Sanción Acumulativa";

                    let parrafo = document.createElement("p");
                    parrafo.setAttribute("class","parrafo_contenedor");
                    parrafo.innerHTML = "Seleccione el Nivel Educativo porfavor:";

                    padre.appendChild(titulo);
                    padre.appendChild(parrafo);
                
                // ------------------------------------------------------------------------------- //

                // Ejecuta la función que consiste en: Mostrar los NIVELES EDUCATIVOS de la BDD
                    mostrar_nivel(tipo); 

            // Si el usuario es un profesor
            }else{
                    let titulo = document.createElement("h1");
                    titulo.setAttribute("class","titulo_contenedor");
                    titulo.innerHTML = "⚠ Solo puede acceder Jefatura de Estudios ⚠";
                    padre.appendChild(titulo);
                    
            }

        }

        function sancion_directa(){
            
            let padre = document.getElementById("contenedor");
            refrescar(padre); 
            padre.style.height = "500%";

            // Saber el rol del usuario
            let rol = document.getElementById("rol").value;

            // Si el usuario es de Jefatura de Estudios
            if(rol == "JEFA"){

                let tipo  = "sancion_directa";
                // ------------------------------ Texto de la Ventana ------------------------------ //

                    let titulo = document.createElement("h1");
                    titulo.setAttribute("class","titulo_contenedor");
                    titulo.innerHTML = "Sanción Directa";

                    let parrafo = document.createElement("p");
                    parrafo.setAttribute("class","parrafo_contenedor");
                    parrafo.innerHTML = "Seleccione el Nivel Educativo porfavor:";

                    padre.appendChild(titulo);
                    padre.appendChild(parrafo);
                
                // ------------------------------------------------------------------------------- //

                // Ejecuta la función que consiste en: Mostrar los NIVELES EDUCATIVOS de la BDD
                    mostrar_nivel(tipo); 

            // Si el usuario es un profesor
            }else{
                    let titulo = document.createElement("h1");
                    titulo.setAttribute("class","titulo_contenedor");
                    titulo.innerHTML = "⚠ Solo puede acceder Jefatura de Estudios ⚠";
                    padre.appendChild(titulo);
                    
            }

        }

        // ---[PUNTO 4]-------------------------------------------------------------------------------------- //
        // Nos muestra las sanciones del alumno seleccionado, si no dispone, no saldrá ninguna                //
        // En caso contrario, saldrá un radio por cada amonestación, y los check se guardán en un array.      //
        // -------------------------------------------------------------------------------------------------- //

        function mostrar_sancion(dni,nombre){

            let padre = document.getElementById("contenedor");
            refrescar(padre); 

            // ------------------------------ Texto de la Ventana ------------------------------ //

            let titulo = document.createElement("h1");
            titulo.setAttribute("class","titulo_contenedor");
            titulo.innerHTML = "Establecer Sanción a " + nombre;

            let parrafo = document.createElement("p");
            parrafo.setAttribute("class","parrafo_contenedor");
            parrafo.innerHTML = "Seleccione las AMONESTACIONES a Sancionar:";

            padre.appendChild(titulo);
            padre.appendChild(parrafo);
        
            // ------------------------------------------------------------------------------- //

            // Declaración del objeto ALUMNOS, que nos lanzaremos en formato JSON permitiendo sacar las amonestaciones
            // de ese ALUMNO, que hemos seleccionando anteriormente.

            ALUMNOS = {
                sancion_tipo : "mostrar_amonestacion_sancion",
                alumnos_dni  : dni,
            }

            // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas
            fetch('php/04_sancion.php',{
                method : 'POST',
                body   : JSON.stringify(ALUMNOS),
            })
    
            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
            .then (respuesta => respuesta.json())
    
            // --- Manipulamos el JSON con el JavaScript
            .then ((respuestaJSON) => {
                
                // El alumno no tiene ninguna amonestacion
                if(respuestaJSON == 0){
                   
                    let parrafo = document.createElement("p");
                    parrafo.setAttribute("class","parrafo_contenedor2");
                    parrafo.innerHTML = "El alumno no tiene ninguna AMONESTACIÓN";
                    padre.appendChild(parrafo);

                // El alumno tiene una o varias amonestaciones
                }else{
                    
                
                    // Mostramos cada amonetación del PHP con un Radio Button
                    for(let i = 0 ; i < respuestaJSON.length ; i++){

                        var amonestacion = document.createElement("p");
                        amonestacion.setAttribute("class","parrafo_contenedor2");
                        amonestacion.innerHTML = "La causa es " + respuestaJSON[i].causa + " en la asignatura " + respuestaJSON[i].asignatura + ", el día: " +respuestaJSON[i].fecha;
                        padre.appendChild(amonestacion);
    
                        var radio = document.createElement("input");
                        radio.setAttribute("type","radio");
                        radio.setAttribute("id","amonestacion"+i);
                        amonestacion.appendChild(radio);

                    }

                    let enviar_sancion = document.createElement("button");
                    enviar_sancion.setAttribute("id","enviar_sancion");
                    enviar_sancion.innerHTML = "Enviar";
                    padre.appendChild(enviar_sancion);

                    // Al presionar ENVIAR
                    document.getElementById("enviar_sancion").addEventListener('click', (event) => {  
                        
                        // Se gurdará el valor de los check en un array
                        var cadena = [];
                        
                        for(let i = 0 ; i < respuestaJSON.length ; i++){

                            let radio_check = document.getElementById("amonestacion"+i).checked;
    
                            if(radio_check == true){
                                
                                cadena[i] = true;

                            }else{
                                cadena[i] = false;
                            }
    
                        }

                        crear_sancion_acumulada(dni,nombre,cadena);

                    }, false);

                }

            })
    
            // En caso de error en la Petición con Fetch
            .catch (() => {
                console.log("@Fetch : Error en Mostrar Sancion/Amonestación ")
            }) 
            
        }

        // ---[PUNTO 4]-------------------------------------------------------------------------------------- //
        // Nos saldrá el modal para establecer la creación de la Sanción de un conjunto de Amonestaciones
        // -------------------------------------------------------------------------------------------------- //

        function crear_sancion_acumulada(dni,nombre,cadena){
            let tipo = "acumulada";
            mostrar_modal(tipo,dni,nombre,cadena,"no","no");
        }
        
        // ---[PUNTO 4]-------------------------------------------------------------------------------------- //
        // Nos saldrá el modal para establecer la creación de la Sanción Directa.
        // -------------------------------------------------------------------------------------------------- //

        function crear_sancion_directa(dni){
            let tipo = "directa";
            mostrar_modal(tipo,dni,"no","no","no","no");
        }

        // ---[PUNTO 4]-------------------------------------------------------------------------------------- //
        // Nos saldrá el modal para establecer la creación de la Sanción Amonestacion, rellenaremos estos datos, y una vez
        // dado en aceptar, nos creará la SANCIÓN y la AMONESTACIÓN. [Punto 4.2]
        // -------------------------------------------------------------------------------------------------- //

        function crear_sancion_amonestacion(dni,causa,asignatura){

            let padre = document.getElementById("contenedor");

            ALUMNOS = {
                sancion_tipo : "mostrar_contenido_sancion",
            }

            // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas y Medidas de Sancion
            fetch('php/04_sancion.php',{
                method : 'POST',
                body   : JSON.stringify(ALUMNOS),
            })
    
            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
            .then (respuesta => respuesta.json())
    
            // --- Manipulamos el JSON con el JavaScript
            .then ((respuestaJSON) => {
                
                var select_motivo  = document.createElement("select");
                select_motivo.setAttribute("id","select_motivo");
                var select_medidas = document.createElement("select");
                select_medidas.setAttribute("id","select_medidas");

                let option = document.createElement("option");
                option.innerHTML = "Proviene de Amonestación";
                select_motivo.appendChild(option);

                // Rellenar los select
                for(let i = 0 ; i < respuestaJSON.length ; i++){

                    let codigo = respuestaJSON[i].codigo.substr(0,2);

                    if(codigo == "SA"){

                    }else{

                        let option = document.createElement("option");
                        option.innerHTML = respuestaJSON[i].motivo;
                        select_medidas.appendChild(option);

                    }

                }
                let tipo = "amonestacion";
                mostrar_modal_amonestacion(select_motivo,select_medidas,tipo);

                // --- ENVIAR ---> Enviamos lo escrito a PHP para establecer la sanción
                document.getElementById("aceptar_modal_sancion").addEventListener('click', (event) => {  
                        
                    // Recogemos los valores obtenidos del MODAL
                    let sancion     = document.getElementById("select_motivo").value;
                    let medidas     = document.getElementById("select_medidas").value;
                    let descripcion = document.getElementById("input_sancion").value;
                    let fecha_c     = document.getElementById("fecha_comienzo").value;
                    let fecha_f     = document.getElementById("fecha_final").value;

                    if(fecha_f > fecha_c){

                        // Declaración del objeto ALUMNOS, que nos lanzaremos en formato JSON permitiendo sacar las amonestaciones
                        // seleccionadas de ese ALUMNO, que hemos seleccionando anteriormente.

                        ALUMNOS = {
                            sancion_tipo           : "amonestacion",
                            alumnos_dni            : dni,
                            alumnos_amonestaciones : causa,
                            alumnos_sancion        : sancion,
                            alumnos_medidas        : medidas,
                            alumnos_descripcion    : descripcion,
                            alumnos_fecha_c        : fecha_c,
                            alumnos_fecha_f        : fecha_f,
                            alumnos_asignatura     : asignatura,
                        }

                        window.modal_sancion.close();
                        cargar();

                        // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas
                        fetch('php/04_sancion.php',{
                            method : 'POST',
                            body   : JSON.stringify(ALUMNOS),
                        })
                
                        // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                        .then (respuesta => respuesta.json())
                
                        // --- Manipulamos el JSON con el JavaScript
                        .then ((respuestaJSON) => {
                            
                            if(respuestaJSON == "correcto"){
                                
                            }else{
                                alert("Ha ocurrido un error a la hora de crear la sanción, intentelo de nuevo");
                                refrescar(padre);
                            }

                        })
                
                        // En caso de error en la Petición con Fetch
                        .catch (() => {
                            // ------------------------------ Texto de la Ventana ------------------------------ //

                            refrescar(padre);
                            
                            let cargar = document.getElementById("cargar");
                            cargar.style.display = 'none';

                            let titulo = document.createElement("h1");
                            titulo.setAttribute("class","titulo_contenedor");
                            titulo.innerHTML = "La Amonestación con Sanción se realizó correctamente" ;
                            
                            let parrafo = document.createElement("p");
                            parrafo.setAttribute("class","parrafo_contenedor");
                            parrafo.innerHTML = "Esperemos que la instancia haya ido bien :)";
                            
                            padre.appendChild(titulo);
                            padre.appendChild(parrafo);
                                        
                            // ------------------------------------------------------------------------------- //
                        }) 

                    }else{
                        alert("La fecha de final no puede ser inferior a la fecha de comienzo");
                    }

                }, false);

                // --- ATRAS ---> Cerramos la ventana modal

                document.getElementById("atras_modal_sancion").addEventListener('click', (event) => { 

                    let cargar = document.getElementById("cargar");
                    cargar.style.display = 'none';
                    window.modal_sancion.close();
                    refrescar(padre);

                }, false);
            })
    
            // En caso de error en la Petición con Fetch
            .catch (() => {
                console.log("@Fetch : Error en Crear Sancion Amonestacion ")
            }) 
          
        }

        // -------------------------------------------------------------------------------------------------- //
        // La función consiste en mostrarnos el modal que aparece a la hora de SANCIÓN DIRECTA O ACUMULADA.
        // -------------------------------------------------------------------------------------------------- //

        function mostrar_modal(tipo,dni,nombre,cadena,causa,asignatura){

            let padre = document.getElementById("contenedor");
            
            // ----------------------- CREACIÓN DEL MODAL ----------------------- //
                        
            let modal = document.createElement("dialog");
            modal.setAttribute("id","modal_sancion");
            padre.appendChild(modal);
            
            // ----------------------- CONTENIDO DEL MODAL ---------------------- // 

            let titulo_modal = document.createElement("h1");
            titulo_modal.setAttribute("class","titulo_contenedor");
            titulo_modal.innerHTML = "Crear Sanción";

            let parrafo = document.createElement("p");
            parrafo.setAttribute("class","parrafo_contenedor");
            parrafo.innerHTML = "Rellene lo siguiente para tramitar la sanción";

            let parrafo_modal = document.createElement("p");
            parrafo_modal.setAttribute("class","parrafo_contenedor2");
            parrafo_modal.innerHTML = "Seleccione el motivo de la sanción";

            let parrafo_modal2 = document.createElement("p");
            parrafo_modal2.setAttribute("class","parrafo_contenedor2");
            parrafo_modal2.innerHTML = "Seleccione la medida correctora";

            let textoExtra = document.createElement("p");
            textoExtra.setAttribute("class","parrafo_contenedor2");
            textoExtra.innerHTML = "Escriba más sobre la sanción:";

            let input = document.createElement("textarea");
            input.setAttribute("id","input_sancion");
            input.setAttribute("placeholder","Más información sobre la sanción");

            let aceptar_modal = document.createElement("button");
            aceptar_modal.setAttribute("id","aceptar_modal_sancion");
            aceptar_modal.innerHTML = "Aceptar";

            let atras_modal = document.createElement("button");
            atras_modal.setAttribute("id","atras_modal_sancion");
            atras_modal.innerHTML = "Atrás";
            
            // Establecer el input date con la fecha actual, y limitando dias futuros.
            // Establece el input date con una fecha futura a la de hoy.

            let textoFecha = document.createElement("p");
            textoFecha.setAttribute("class","parrafo_contenedor2");
            textoFecha.innerHTML = "Establezca las fechas de la sanción:";

            let fecha_actual = new Date();

            let label_comienzo = document.createElement("label");
            label_comienzo.setAttribute("class","labelFechas");
            label_comienzo.innerHTML = "Fecha Comienzo";

            let fecha_comienzo = document.createElement("input");
            fecha_comienzo.setAttribute("type","date");
            fecha_comienzo.setAttribute("id","fecha_comienzo");
            fecha_comienzo.setAttribute("value",fecha_actual.toJSON().slice(0,10));
            fecha_comienzo.setAttribute("min",fecha_actual.toJSON().slice(0,10)); // Establece máximo hoy
            padre.appendChild(fecha_comienzo);
            
            let label_final = document.createElement("label");
            label_final.setAttribute("class","labelFechas");
            label_final.innerHTML = "Fecha Final";

            let fecha_final = document.createElement("input");
            fecha_final.setAttribute("type","date");
            fecha_final.setAttribute("id","fecha_final");
            fecha_final.setAttribute("value",fecha_actual.toJSON().slice(0,10));
            fecha_final.setAttribute("min",fecha_actual.toJSON().slice(0,10)); // Establece minimo hoy
            padre.appendChild(fecha_final);

            // ----------------------- INSERTAR EL MODAL ---------------------- //
            
            modal.appendChild(titulo_modal);
            modal.appendChild(parrafo);
            
            // *************************** SANCION ACUMULADA ********************* //

            if(tipo == "acumulada"){

                ALUMNOS = {
                    sancion_tipo : "mostrar_contenido_sancion",
                }
    
                // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas y Medidas de Sancion
                fetch('php/04_sancion.php',{
                    method : 'POST',
                    body   : JSON.stringify(ALUMNOS),
                })
        
                // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                .then (respuesta => respuesta.json())
        
                // --- Manipulamos el JSON con el JavaScript
                .then ((respuestaJSON) => {
                    
                    var select_motivo  = document.createElement("select");
                    select_motivo.setAttribute("id","select_motivo");
                    var select_medidas = document.createElement("select");
                    select_medidas.setAttribute("id","select_medidas");
    
                    // Rellenar los select con los motivos de las tablas.
                    for(let i = 0 ; i < respuestaJSON.length ; i++){
    
                        let codigo = respuestaJSON[i].codigo.substr(0,2);
    
                        if(codigo == "ME"){
    
                            let option = document.createElement("option");
                            option.innerHTML = respuestaJSON[i].motivo;
                            select_medidas.appendChild(option);
    
                        }
    
                    }
    
                    let option = document.createElement("option");
                    option.innerHTML = "Conjunto de Amonestaciones";
                    select_motivo.appendChild(option);
    
                    modal.appendChild(parrafo_modal);
                    modal.appendChild(select_motivo);
                    modal.appendChild(parrafo_modal2);
                    modal.appendChild(select_medidas);
        
                    modal.appendChild(textoExtra);
                    modal.appendChild(input);
        
                    modal.appendChild(textoFecha);
                    modal.appendChild(label_comienzo);
                    modal.appendChild(fecha_comienzo);
                    modal.appendChild(label_final);
                    modal.appendChild(fecha_final);
        
                    modal.appendChild(aceptar_modal);
                    modal.appendChild(atras_modal);
                    
                    // --- ENVIAR ---> Enviamos lo escrito a PHP para establecer la sanción
                    document.getElementById("aceptar_modal_sancion").addEventListener('click', (event) => {  
                            
                        // Recogemos los valores obtenidos del MODAL
                        let sancion     = document.getElementById("select_motivo").value;
                        let medidas     = document.getElementById("select_medidas").value;
                        let descripcion = document.getElementById("input_sancion").value;
                        let fecha_c     = document.getElementById("fecha_comienzo").value;
                        let fecha_f     = document.getElementById("fecha_final").value;
                        
                        if(fecha_f > fecha_c){
                            // Declaración del objeto ALUMNOS, que nos lanzaremos en formato JSON permitiendo sacar las amonestaciones
                            // seleccionadas de ese ALUMNO, que hemos seleccionando anteriormente.
        
                            ALUMNOS = {
                                sancion_tipo           : "acumulada",
                                alumnos_dni            : dni,
                                alumnos_amonestaciones : cadena,
                                alumnos_sancion        : sancion,
                                alumnos_medidas        : medidas,
                                alumnos_descripcion    : descripcion,
                                alumnos_fecha_c        : fecha_c,
                                alumnos_fecha_f        : fecha_f,
                            }
        
                            window.modal_sancion.close();
                            cargar();

                            // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas
                            fetch('php/04_sancion.php',{
                                method : 'POST',
                                body   : JSON.stringify(ALUMNOS),
                            })
                    
                            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                            .then (respuesta => respuesta.json())
                    
                            // --- Manipulamos el JSON con el JavaScript
                            .then ((respuestaJSON) => {
                                
                                if(respuestaJSON == "correcto"){
        
                                }else{
                                    if(respuestaJSON == "todoFalse"){
                                        alert("Debes de seleccionar al menos una amonestación");
                                        mostrar_sancion(dni,nombre);
                                    }else{
                                        alert("Ha ocurrido un error a la hora de crear la sanción, intentelo de nuevo");
                                        refrescar(padre);
                                    }
        
                                }
        
                            })
                    
                            // En caso de error en la Petición con Fetch
                            .catch (() => {
                                // ------------------------------ Texto de la Ventana ------------------------------ //
        
                                refrescar(padre);

                                let cargar = document.getElementById("cargar");
                                cargar.style.display = "none";

                                let titulo = document.createElement("h1");
                                titulo.setAttribute("class","titulo_contenedor");
                                titulo.innerHTML = "La sanción acumulativa se realizó correctamente" ;
        
                                let parrafo = document.createElement("p");
                                parrafo.setAttribute("class","parrafo_contenedor");
                                parrafo.innerHTML = "Esperemos que la instancia haya ido bien :)";
        
                                padre.appendChild(titulo);
                                padre.appendChild(parrafo);
                
                            // ------------------------------------------------------------------------------- //
                            }) 
                        
                        }else{
                            alert("La fecha de final no puede ser inferior a la fecha de comienzo");
                        }

                    }, false);
    
                    // --- ATRAS ---> Cerramos la ventana modal
    
                    document.getElementById("atras_modal_sancion").addEventListener('click', (event) => { 
    
                        window.modal_sancion.close();
                        refrescar(padre);
    
                    }, false);
                })
        
                // En caso de error en la Petición con Fetch
                .catch (() => {
                    console.log("@Fetch : Error en Crear Sancion ")
                }) 
            }

            // *************************** SANCION DIRECTA *********************** //

            if(tipo == "directa"){

                ALUMNOS = {
                    sancion_tipo : "mostrar_contenido_sancion",
                }
    
                // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas y Medidas de Sancion
                fetch('php/04_sancion.php',{
                    method : 'POST',
                    body   : JSON.stringify(ALUMNOS),
                })
        
                // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                .then (respuesta => respuesta.json())
        
                // --- Manipulamos el JSON con el JavaScript
                .then ((respuestaJSON) => {
                    
                    var select_motivo  = document.createElement("select");
                    select_motivo.setAttribute("id","select_motivo");
                    var select_medidas = document.createElement("select");
                    select_medidas.setAttribute("id","select_medidas");
    
                    // Rellenar los select
                    for(let i = 0 ; i < respuestaJSON.length ; i++){
    
                        let codigo = respuestaJSON[i].codigo.substr(0,2);
    
                        if(codigo == "SA" && i != 0){
    
                            let option = document.createElement("option");
                            option.innerHTML = respuestaJSON[i].motivo;
                            select_motivo.appendChild(option);
    
                        }else{
    
                            if(codigo == "ME"){
                                let option = document.createElement("option");
                                option.innerHTML = respuestaJSON[i].motivo;
                                select_medidas.appendChild(option);
                            }
                            
                        }
    
                    }

                    modal.appendChild(parrafo_modal);
                    modal.appendChild(select_motivo);
                    modal.appendChild(parrafo_modal2);
                    modal.appendChild(select_medidas);
        
                    modal.appendChild(textoExtra);
                    modal.appendChild(input);
        
                    modal.appendChild(textoFecha);
                    modal.appendChild(label_comienzo);
                    modal.appendChild(fecha_comienzo);
                    modal.appendChild(label_final);
                    modal.appendChild(fecha_final);
        
                    modal.appendChild(aceptar_modal);
                    modal.appendChild(atras_modal);

                    // --- ENVIAR ---> Enviamos lo escrito a PHP para establecer la sanción
                    document.getElementById("aceptar_modal_sancion").addEventListener('click', (event) => {  
                        
                        // Recogemos los valores obtenidos del MODAL
                        let sancion     = document.getElementById("select_motivo").value;
                        let medidas     = document.getElementById("select_medidas").value;
                        let descripcion = document.getElementById("input_sancion").value;
                        let fecha_c     = document.getElementById("fecha_comienzo").value;
                        let fecha_f     = document.getElementById("fecha_final").value;
    
                        if(fecha_f > fecha_c){

                            // Declaración del objeto ALUMNOS, que nos lanzaremos en formato JSON permitiendo sacar las amonestaciones
                            // seleccionadas de ese ALUMNO, que hemos seleccionando anteriormente.
        
                            ALUMNOS = {
                                alumnos_dni            : dni,
                                alumnos_sancion        : sancion,
                                alumnos_medidas        : medidas,
                                alumnos_descripcion    : descripcion,
                                alumnos_fecha_c        : fecha_c,
                                alumnos_fecha_f        : fecha_f,
                                sancion_tipo           : "directa",
                            }

                            window.modal_sancion.close();
                            cargar();

                            // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas
                            fetch('php/04_sancion.php',{
                                method : 'POST',
                                body   : JSON.stringify(ALUMNOS),
                            })
                    
                            
                            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
                            .then (respuesta => respuesta.json())
                    
                            // --- Manipulamos el JSON con el JavaScript
                            .then ((respuestaJSON) => {
                                
                                if(respuestaJSON.length >= 1){
                                    
                                
                                }else{
        
                                    alert("Ha ocurrido un error a la hora de crear la sanción, intentelo de nuevo");
                                    refrescar(padre);
                                    
                                }
        
                            })
                    
                            // En caso de error en la Petición con Fetch
                            .catch (() => {
                                
                            // ------------------------------ Texto de la Ventana ------------------------------ //
                            
                            refrescar(padre);

                            let cargar = document.getElementById("cargar");
                            cargar.style.display = "none";

                            let titulo = document.createElement("h1");
                            titulo.setAttribute("class","titulo_contenedor");
                            titulo.innerHTML = "La sanción directa se realizó correctamente" ;
                                
                            let parrafo = document.createElement("p");
                            parrafo.setAttribute("class","parrafo_contenedor");
                            parrafo.innerHTML = "Esperemos que la instancia haya ido bien :)";
                                
                            padre.appendChild(titulo);
                            padre.appendChild(parrafo);
                                            
                            // ------------------------------------------------------------------------------- //
        
                            }) 
                        
                        }else{
                            alert("La fecha de final no puede ser inferior a la fecha de comienzo");
                        }

                    }, false);
    
                    // --- ATRAS ---> Cerramos la ventana modal
    
                    document.getElementById("atras_modal_sancion").addEventListener('click', (event) => { 
    
                        window.modal_sancion.close();
                        refrescar(padre);
    
                    }, false);
                })
        
                // En caso de error en la Petición con Fetch
                .catch (() => {
                    console.log("@Fetch : Error en Crear Sancion ")
                }) 

            }

            // ------------------- AÑADIR SANCION - MEDIDAS --------------------- //

            if(tipo == "directa"){
                let crear_motivo_sancion = document.createElement("button");
                crear_motivo_sancion.setAttribute("id","motivo_sancion");
                crear_motivo_sancion.innerHTML = "Crear Motivo de Sanción"
                modal.appendChild(crear_motivo_sancion);
            }
            if(tipo == "acumulada"){
                let crear_motivo_sancion = document.createElement("button");
                crear_motivo_sancion.setAttribute("id","motivo_sancion");
                crear_motivo_sancion.innerHTML = "Crear Motivo de Sanción"
                crear_motivo_sancion.style.display = "none";
                modal.appendChild(crear_motivo_sancion);
            }

            let medida_correctora = document.createElement("button");
            medida_correctora.setAttribute("id","medida_correctora");
            medida_correctora.innerHTML = "Crear Medida Correctora"
            modal.appendChild(medida_correctora);

            // Abrimos el modal, y nos dará dos opciones. Enviar o Atras
            window.modal_sancion.showModal();

            // Añadir Motivos de Sanción
            document.getElementById("motivo_sancion").addEventListener('click', () => {  
                window.modal_sancion.close();
                crear_motivo_sancion(tipo,dni,nombre,cadena,causa,asignatura);
            });

            // Añadir Medidas Correctoras
            document.getElementById("medida_correctora").addEventListener('click', () => {  
                window.modal_sancion.close();
                crear_medida_correctora(tipo,dni,nombre,cadena,causa,asignatura);
            });

        }

        // -------------------------------------------------------------------------------------------------- //
        // La función consiste en mostrarnos el modal que aparece a la hora de SANCIÓN AMONESTACIÓN
        // -------------------------------------------------------------------------------------------------- //

        function mostrar_modal_amonestacion(select_motivo,select_medidas,tipo){

            let padre = document.getElementById("contenedor");
            
            // ----------------------- CREACIÓN DEL MODAL ----------------------- //
                        
            let modal = document.createElement("dialog");
            modal.setAttribute("id","modal_sancion");
            padre.appendChild(modal);
            
            // ----------------------- CONTENIDO DEL MODAL ---------------------- // 

            let titulo_modal = document.createElement("h1");
            titulo_modal.setAttribute("class","titulo_contenedor");
            titulo_modal.innerHTML = "Crear Sanción";

            let parrafo = document.createElement("p");
            parrafo.setAttribute("class","parrafo_contenedor");
            parrafo.innerHTML = "Rellene lo siguiente para tramitar la sanción";

            let parrafo_modal = document.createElement("p");
            parrafo_modal.setAttribute("class","parrafo_contenedor2");
            parrafo_modal.innerHTML = "Seleccione el motivo de la sanción";

            let parrafo_modal2 = document.createElement("p");
            parrafo_modal2.setAttribute("class","parrafo_contenedor2");
            parrafo_modal2.innerHTML = "Seleccione la medida correctora";

            let textoExtra = document.createElement("p");
            textoExtra.setAttribute("class","parrafo_contenedor2");
            textoExtra.innerHTML = "Escriba más sobre la sanción:";

            let input = document.createElement("textarea");
            input.setAttribute("id","input_sancion");
            input.setAttribute("placeholder","Más información sobre la sanción");

            let aceptar_modal = document.createElement("button");
            aceptar_modal.setAttribute("id","aceptar_modal_sancion");
            aceptar_modal.innerHTML = "Aceptar";

            let atras_modal = document.createElement("button");
            atras_modal.setAttribute("id","atras_modal_sancion");
            atras_modal.innerHTML = "Atrás";
            
            // Establecer el input date con la fecha actual, y limitando dias futuros.
            // Establece el input date con una fecha futura a la de hoy.

            let textoFecha = document.createElement("p");
            textoFecha.setAttribute("class","parrafo_contenedor2");
            textoFecha.innerHTML = "Establezca las fechas de la sanción:";

            let fecha_actual = new Date();

            let label_comienzo = document.createElement("label");
            label_comienzo.setAttribute("class","labelFechas");
            label_comienzo.innerHTML = "Fecha Comienzo";

            let fecha_comienzo = document.createElement("input");
            fecha_comienzo.setAttribute("type","date");
            fecha_comienzo.setAttribute("id","fecha_comienzo");
            fecha_comienzo.setAttribute("value",fecha_actual.toJSON().slice(0,10));
            fecha_comienzo.setAttribute("min",fecha_actual.toJSON().slice(0,10)); // Establece mínimo hoy
            padre.appendChild(fecha_comienzo);
            
            let label_final = document.createElement("label");
            label_final.setAttribute("class","labelFechas");
            label_final.innerHTML = "Fecha Final";

            let fecha_final = document.createElement("input");
            fecha_final.setAttribute("type","date");
            fecha_final.setAttribute("id","fecha_final");
            fecha_final.setAttribute("value",fecha_actual.toJSON().slice(0,10));
            fecha_final.setAttribute("min",fecha_actual.toJSON().slice(0,10)); // Establece minimo hoy
            padre.appendChild(fecha_final);

            // ----------------------- INSERTAR EL MODAL ---------------------- //
            
            modal.appendChild(titulo_modal);
            modal.appendChild(parrafo);
            
            modal.appendChild(parrafo_modal);
            modal.appendChild(select_motivo);
            modal.appendChild(parrafo_modal2);
            modal.appendChild(select_medidas);

            modal.appendChild(textoExtra);
            modal.appendChild(input);

            modal.appendChild(textoFecha);
            modal.appendChild(label_comienzo);
            modal.appendChild(fecha_comienzo);
            modal.appendChild(label_final);
            modal.appendChild(fecha_final);

            modal.appendChild(aceptar_modal);
            modal.appendChild(atras_modal);

            // Abrimos el modal, y nos dará dos opciones. Enviar o Atras
            window.modal_sancion.showModal();

        }

//**************************************************************************************************************//
//---------------------------------------------------- LISTADO -------------------------------------------------//
//**************************************************************************************************************//

        // ---[PUNTO 5]-------------------------------------------------------------------------------------- //
        // Nos muestra la ventana de LISTADO, con las opciones de los listados disponibles 
        // -------------------------------------------------------------------------------------------------- //

        function listado(){

            let padre = document.getElementById("contenedor");
            refrescar(padre); 

            // Saber el rol del usuario
            let rol = document.getElementById("rol").value;

            // Si el usuario es de Jefatura de Estudios
            if(rol == "JEFA"){

                // ------------------------------ Texto de la Ventana ------------------------------ //
  
                    let titulo = document.createElement("h1");
                    titulo.setAttribute("class","titulo_contenedor");
                    titulo.innerHTML = "Listado";

                    let parrafo = document.createElement("p");
                    parrafo.setAttribute("class","parrafo_contenedor");
                    parrafo.innerHTML = "Seleccione que opción quiere listar:";

                    padre.appendChild(titulo);
                    padre.appendChild(parrafo);

                // ------------------------------------------------------------------------------- //

                    let boton1 = document.createElement("button");
                    boton1.setAttribute("id","boton1");
                    boton1.setAttribute("class","botonlistado");
                    boton1.innerHTML = "Amonestaciones y Sanciones por Alumno";

                    let boton2 = document.createElement("button");
                    boton2.setAttribute("id","boton2");
                    boton2.setAttribute("class","botonlistado");
                    boton2.innerHTML = "Listado de alumnos que no tienen fecha de firma";

                    let boton3 = document.createElement("button");
                    boton3.setAttribute("id","boton3");
                    boton3.setAttribute("class","botonlistado");
                    boton3.innerHTML = "Amonestaciones por Profesor indicando información Alumno";

                    let boton4 = document.createElement("button");
                    boton4.setAttribute("id","boton4");
                    boton4.setAttribute("class","botonlistado");
                    boton4.innerHTML = "Total de Amonestaciones y Sanciones por Grupo";

                    let boton5 = document.createElement("button");
                    boton5.setAttribute("id","boton5");
                    boton5.setAttribute("class","botonlistado");
                    boton5.innerHTML = "Total de Amonestaciones de todos los Profesores";

                    padre.appendChild(boton1);
                    padre.appendChild(boton2);
                    padre.appendChild(boton3);
                    padre.appendChild(boton4);
                    padre.appendChild(boton5);

                    boton1.addEventListener("click",listado_amonestacion_sancion);
                    boton2.addEventListener("click",listado_pendientes_firma);
                    boton3.addEventListener("click",listado_profesor_alumno);
                    boton4.addEventListener("click",listado_amonestacion_grupo);
                    boton5.addEventListener("click",listado_total_profesores);

                // Si el usuario es un profesor
                }else{
                        let titulo = document.createElement("h1");
                        titulo.setAttribute("class","titulo_contenedor");
                        titulo.innerHTML = "⚠ Solo puede acceder Jefatura de Estudios ⚠";
                        padre.appendChild(titulo);
                        
                }            
        }

//**************************************************************************************************************//
//---------------------------------------------- LISTADO - OPCIONES --------------------------------------------//
//**************************************************************************************************************//

        // ---[PUNTO 5]-------------------------------------------------------------------------------------- //
        // Amonestaciones y Sanciones por Alumno
        // -------------------------------------------------------------------------------------------------- //

        function listado_amonestacion_sancion(){
           
            let padre = document.getElementById("contenedor");
            refrescar(padre); 
            padre.style.height = "500%";

            // ------------------------------ Texto de la Ventana ------------------------------ //

                let titulo = document.createElement("h1");
                titulo.setAttribute("class","titulo_contenedor");
                titulo.innerHTML = "Amonestaciones y Sanciones por Alumno";
                       
                padre.appendChild(titulo);
                               
            // ------------------------------------------------------------------------------- //

            let boton = document.createElement("button");
            boton.setAttribute("id","botonPDF");
            boton.innerHTML = "Obtener PDF";
            padre.appendChild(boton);

            // Declaración del objeto LISTADOS, donde le mandaremos una cadena identificando que listado recoge el PHP

            LISTADO = {
                listado_cadena : "listado_1",
            }

            // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas
            fetch('php/05_listado.php',{
                method : 'POST',
                body   : JSON.stringify(LISTADO),
            })
    
            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
            .then (respuesta => respuesta.json())
    
            // --- Manipulamos el JSON con el JavaScript
            .then ((respuestaJSON) => {
                
                // Para almacenar lo que nos devuelva el JSON
                var cadena = [];
                var content = [];
                content.push({text : "Sanciones y Amonestaciones por Alumno", fontSize : 32})

                for(let i = 0 ; i < respuestaJSON.length ; i++){

                    let parrafo = document.createElement("p");
                    parrafo.setAttribute("id","parrafo_listado");
                    
                    // Para insertar un Alumno
                    if(respuestaJSON[i].dni){
                        parrafo.style.fontWeight = "bold";
                        parrafo.style.textDecoration = "underline";

                        if(respuestaJSON[i].grupo != "no"){

                            parrafo.innerHTML = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos + " de la clase: " + respuestaJSON[i].nivel + " " + respuestaJSON[i].grupo; 
                            cadena[i] = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos + " de la clase: " + respuestaJSON[i].nivel + " " + respuestaJSON[i].grupo; 
                            content.push({text : cadena[i], background : "#242961", color : "white"});

                        }else{
                            parrafo.innerHTML = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos + " de la clase: " + respuestaJSON[i].nivel;
                            cadena[i] = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos + " de la clase: " + respuestaJSON[i].nivel;
                            content.push({text : cadena[i], background : "#242961", color : "white"});
                            
                        }

                    }
                    
                    // Para insertar las amonestaciones
                    if(respuestaJSON[i].causa){

                        parrafo.style.position = "relative";
                        parrafo.style.left = "15%";
                        parrafo.innerHTML = "AMONESTACIÓN: " + respuestaJSON[i].causa + " el día " + respuestaJSON[i].fecha;
                        cadena[i] = "AMONESTACIÓN: " + respuestaJSON[i].causa + " el día " + respuestaJSON[i].fecha;
                        content.push({text : cadena[i], margin : [25,0,0,0]});
                    }

                    // Para insertar sanciones acumulativas
                    if(respuestaJSON[i].codigo_sancion == "Conjunto de Amonestaciones"){
                        parrafo.style.position = "relative";
                        parrafo.style.left = "15%";

                        parrafo.innerHTML = "SANCIÓN ACUMULADA  con fecha: " + respuestaJSON[i].fecha_inicio + " a " + respuestaJSON[i].fecha_fin+". ";
                        cadena[i] = "SANCIÓN ACUMULADA  con fecha: " + respuestaJSON[i].fecha_inicio + " a " + respuestaJSON[i].fecha_fin+". ";
                        content.push({text : cadena[i], margin : [25,0,0,0]});
                        
                        parrafo.innerHTML += "<br>La descripción de la sanción es: " + respuestaJSON[i].descripcion;
                        cadena[i] += "La descripción de la sanción es: " + respuestaJSON[i].descripcion;
                        content.push({text : cadena[i], margin : [25,0,0,0]});
                        
                    }

                    // Para insertar sanciones derivadas de AMONESTACION
                    if(respuestaJSON[i].codigo_sancion == "Proviene de Amonestación"){
                        parrafo.style.position = "relative";
                        parrafo.style.left = "15%";

                        parrafo.innerHTML = "SANCIÓN DERIVADAS DE AMONESTACIÓN con fecha: " + respuestaJSON[i].fecha_inicio + " a " + respuestaJSON[i].fecha_fin+". ";
                        cadena[i] = "SANCIÓN DERIVADAS DE AMONESTACIÓN con fecha: " + respuestaJSON[i].fecha_inicio + " a " + respuestaJSON[i].fecha_fin+". ";
                        content.push({text : cadena[i], margin : [25,0,0,0]});
                        
                        parrafo.innerHTML += "<br>La descripción de la sanción es: " + respuestaJSON[i].descripcion;
                        cadena[i] += "La descripción de la sanción es: " + respuestaJSON[i].descripcion;
                        content.push({text : cadena[i], margin : [25,0,0,0]});
                        
                    }

                    // Para insertar sanciones directas
                    if(respuestaJSON[i].codigo_sancion != "Conjunto de Amonestaciones" && respuestaJSON[i].codigo_sancion != "Proviene de Amonestación"  && respuestaJSON[i].codigo_sancion != undefined){
                        parrafo.style.position = "relative";
                        parrafo.style.left = "15%";

                        parrafo.innerHTML = "SANCIÓN DIRECTA: " + respuestaJSON[i].codigo_sancion + " con fecha: " + respuestaJSON[i].fecha_inicio + " a " + respuestaJSON[i].fecha_fin+". ";
                        cadena[i] = "SANCIÓN DIRECTA: " + respuestaJSON[i].codigo_sancion + " con fecha: " + respuestaJSON[i].fecha_inicio + " a " + respuestaJSON[i].fecha_fin+". ";
                        content.push({text : cadena[i], margin : [25,0,0,0]});
                        
                        parrafo.innerHTML += "<br>La descripción de la sanción es: " + respuestaJSON[i].descripcion;
                        cadena[i] += "La descripción de la sanción es: " + respuestaJSON[i].descripcion;
                        content.push({text : cadena[i], margin : [25,0,0,0]});
                    }     
                    padre.appendChild(parrafo);
                        
                }
                    
               // Ejecuta la función que nos implementa la falta en conjunto a todos los pasos anteriores.
               boton.addEventListener('click', (event) => {
                    
                    var docDefinition = {content: content}
                    pdfMake.createPdf(docDefinition).open();

                }, false);
            
            })

            // En caso de error en la Petición con Fetch
            .catch (() => {
                console.log("@Fetch : Error en Listado 3 ")
            }) 

        }

        // ---[PUNTO 5]-------------------------------------------------------------------------------------- //
        // Listado de alumnos que no tienen fecha de firma
        // -------------------------------------------------------------------------------------------------- //

        function listado_pendientes_firma(){
            
            let padre = document.getElementById("contenedor");
            refrescar(padre); 
            padre.style.height = "500%";

            // ------------------------------ Texto de la Ventana ------------------------------ //

                let titulo = document.createElement("h1");
                titulo.setAttribute("class","titulo_contenedor");
                titulo.innerHTML = "Listado de alumnos que no tienen fecha de firma de la familia";
                       
                padre.appendChild(titulo);
                               
            // ------------------------------------------------------------------------------- //

            let boton = document.createElement("button");
            boton.setAttribute("id","botonPDF");
            boton.innerHTML = "Obtener PDF";
            padre.appendChild(boton);

            // Declaración del objeto LISTADOS, donde le mandaremos una cadena identificando que listado recoge el PHP

            LISTADO = {
                listado_cadena : "listado_2",
            }

            // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas
            fetch('php/05_listado.php',{
                method : 'POST',
                body   : JSON.stringify(LISTADO),
            })
    
            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
            .then (respuesta => respuesta.json())
    
            // --- Manipulamos el JSON con el JavaScript
            .then ((respuestaJSON) => {
                
                // Para almacenar lo que nos devuelva el JSON
                var cadena = [];
                var content = [];
                content.push({text : "Pendientes de Firma", fontSize : 32});

                for(let i = 0 ; i < respuestaJSON.length ; i++){

                    let parrafo = document.createElement("p");
                    parrafo.setAttribute("id","parrafo_listado");
                    
                    if(respuestaJSON[i].grupo != "no" && respuestaJSON[i].causa == null){
                        parrafo.style.fontWeight = "bold";
                        parrafo.style.textDecoration = "underline";

                        parrafo.innerHTML = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos + " de la clase: " + respuestaJSON[i].nivel + " " + respuestaJSON[i].grupo; 
                        cadena[i] = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos + " de la clase: " + respuestaJSON[i].nivel + " " + respuestaJSON[i].grupo; 
                        content.push({text : cadena[i], background : "#242961", color : "white"});

                    }
                    if(respuestaJSON[i].grupo == "no" && respuestaJSON[i].causa == null){
                        parrafo.style.fontWeight = "bold";
                        parrafo.style.textDecoration = "underline";
                        parrafo.innerHTML = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos + " de la clase: " + respuestaJSON[i].nivel;
                        cadena[i] = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos + " de la clase: " + respuestaJSON[i].nivel; 
                        content.push({text : cadena[i], background : "#242961", color : "white"});
                    }

                    if(respuestaJSON[i].causa){
                        parrafo.style.textDecoration = "none";
                        parrafo.style.position = "relative";
                        parrafo.style.left = "15%";
                        parrafo.innerHTML = "La causa es " + respuestaJSON[i].causa + " en la asignatura " + respuestaJSON[i].asignatura + ", el día: " +respuestaJSON[i].fecha;
                        cadena[i] = "La causa es " + respuestaJSON[i].causa + " en la asignatura " + respuestaJSON[i].asignatura + ", el día: " +respuestaJSON[i].fecha;
                        content.push({text : cadena[i], margin : [25,0,0,0]});
                    }

                    padre.appendChild(parrafo);
                    
                }

               
                // Ejecuta la función que nos implementa la falta en conjunto a todos los pasos anteriores.
               boton.addEventListener('click', (event) => {
                    
                    var docDefinition = {content: content}
                    pdfMake.createPdf(docDefinition).open();

                }, false);
                
            })
    
            // En caso de error en la Petición con Fetch
            .catch (() => {
                console.log("@Fetch : Error en Listado 3 ")
            }) 

        }
        
        // ---[PUNTO 5]-------------------------------------------------------------------------------------- //
        // Amonestaciones por Profesor indicando información Alumno
        // -------------------------------------------------------------------------------------------------- //

        function listado_profesor_alumno(){
            
            let padre = document.getElementById("contenedor");
            refrescar(padre); 
            padre.style.height = "500%";

            // ------------------------------ Texto de la Ventana ------------------------------ //

                let titulo = document.createElement("h1");
                titulo.setAttribute("class","titulo_contenedor");
                titulo.innerHTML = "Amonestaciones por profesor indicando la información del alumno";
                       
                padre.appendChild(titulo);
                               
            // ------------------------------------------------------------------------------- //

            let boton = document.createElement("button");
            boton.setAttribute("id","botonPDF");
            boton.innerHTML = "Obtener PDF";
            padre.appendChild(boton);

            // Declaración del objeto LISTADOS, donde le mandaremos una cadena identificando que listado recoge el PHP

            LISTADO = {
                listado_cadena : "listado_3",
            }

            // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas
            fetch('php/05_listado.php',{
                method : 'POST',
                body   : JSON.stringify(LISTADO),
            })
    
            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
            .then (respuesta => respuesta.json())
    
            // --- Manipulamos el JSON con el JavaScript
            .then ((respuestaJSON) => {
                
                // Para almacenar lo que nos devuelva el JSON
                var cadena = [];
                var content = [];
                content.push({text : "Amonestaciones por Profesor, indicando Alumnos", fontSize : 32})

                for(let i = 0 ; i < respuestaJSON.length ; i++){

                    let parrafo = document.createElement("p");
                    parrafo.setAttribute("id","parrafo_listado");
            
                    // Mostrar Profesor
                    if(respuestaJSON[i].total){

                        parrafo.style.fontWeight = "bold";
                        parrafo.style.textDecoration = "underline";

                        if(respuestaJSON[i].total != "1"){
                            parrafo.innerHTML = respuestaJSON[i].total + " amonestaciones de: " + respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos;
                            cadena[i] = respuestaJSON[i].total + " amonestaciones de: " + respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos;
                            content.push({text : cadena[i], background : "#242961", color : "white"});
                        }else{
                            parrafo.innerHTML = respuestaJSON[i].total + " amonestación de: " + respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos;
                            cadena[i] = respuestaJSON[i].total + " amonestación de: " + respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos;
                            content.push({text : cadena[i], background : "#242961", color : "white"});
                        }

                    }

                    // Mostrar Alumno
                    if(respuestaJSON[i].nivel){

                        parrafo.style.position = "relative";
                        parrafo.style.left = "15%";

                        if(respuestaJSON[i].grupo != "no"){
                            
                            parrafo.innerHTML = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos + " de la clase: " + respuestaJSON[i].nivel + " " + respuestaJSON[i].grupo; 
                            cadena[i] = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos + " de la clase: " + respuestaJSON[i].nivel + " " + respuestaJSON[i].grupo; 
                            content.push({text : cadena[i], background : "#8288c3", color : "white", margin : [25,0,0,0]});
                        }else{

                            parrafo.innerHTML = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos + " de la clase: " + respuestaJSON[i].nivel;
                            cadena[i] = respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos + " de la clase: " + respuestaJSON[i].nivel;
                            content.push({text : cadena[i], background : "#8288c3", color : "white", margin : [25,0,0,0]});
                        }

                    }
                    padre.appendChild(parrafo);
                    
                }

                // Ejecuta la función que nos implementa la falta en conjunto a todos los pasos anteriores.
                boton.addEventListener('click', (event) => {
                    
                    var docDefinition = {content: content}
                    pdfMake.createPdf(docDefinition).open();

                }, false);

                })
    
            // En caso de error en la Petición con Fetch
            .catch (() => {
                console.log("@Fetch : Error en Listado 3 ")
            }) 

        }

        // ---[PUNTO 5]-------------------------------------------------------------------------------------- //
        // Total de amonestaciones por grupo. En el que se obtendrá el número de amonestaciones y sanciones 
        // por cada uno de los alumnos perteneciente a un grupo
        // -------------------------------------------------------------------------------------------------- //

        function listado_amonestacion_grupo(){
            
            let padre = document.getElementById("contenedor");
            refrescar(padre); 
            padre.style.height = "500%";

            // ------------------------------ Texto de la Ventana ------------------------------ //

                let titulo = document.createElement("h1");
                titulo.setAttribute("class","titulo_contenedor");
                titulo.innerHTML = "Total de amonestaciones y sanciones por grupo";
                       
                padre.appendChild(titulo);
                               
            // ------------------------------------------------------------------------------- //

            let boton = document.createElement("button");
            boton.setAttribute("id","botonPDF");
            boton.innerHTML = "Obtener PDF";
            padre.appendChild(boton);

            // Declaración del objeto LISTADOS, donde le mandaremos una cadena identificando que listado recoge el PHP

            LISTADO = {
                listado_cadena : "listado_4",
            }

            // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas
            fetch('php/05_listado.php',{
                method : 'POST',
                body   : JSON.stringify(LISTADO),
            })
    
            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
            .then (respuesta => respuesta.json())
    
            // --- Manipulamos el JSON con el JavaScript
            .then ((respuestaJSON) => {
                
                // Para almacenar lo que nos devuelva el JSON
                var cadena = [];
                var content = [];
                content.push({text : "Total de Amonestaciones y Sanciones por Grupo", fontSize : 32})

                for(let i = 0 ; i < respuestaJSON.length ; i++){

                    let parrafo = document.createElement("p");
                    parrafo.setAttribute("id","parrafo_listado");

                    // Mostrar NIVEL
                    if(respuestaJSON[i].total){

                        parrafo.style.fontWeight = "bold";
                        parrafo.style.textDecoration = "underline";

                        if(respuestaJSON[i].grupo != "no"){
                            parrafo.innerHTML = "El total de faltas  en la clase "+ respuestaJSON[i].nivel+ " " + respuestaJSON[i].grupo + " son:";
                            cadena[i] = "El total de faltas  en la clase "+ respuestaJSON[i].nivel+ " " + respuestaJSON[i].grupo + " son:";
                            content.push({text : cadena[i], background : "#242961", color : "white"});
                        }else{
                            parrafo.innerHTML = "El total de faltas  en la clase "+ respuestaJSON[i].nivel+ " son:";
                            cadena[i] = "El total de faltas  en la clase "+ respuestaJSON[i].nivel+ " son:";
                            content.push({text : cadena[i], background : "#242961", color : "white"});
                        }

                    }

                        if(respuestaJSON[i].total_amonestaciones){
                            parrafo.style.position = "relative";
                            parrafo.style.left = "15%";

                            parrafo.innerHTML = respuestaJSON[i].total_amonestaciones + " AMONESTACIONES son de: " + respuestaJSON[i].nombre+ " " + respuestaJSON[i].apellidos;
                            cadena[i] = respuestaJSON[i].total_amonestaciones + " AMONESTACIONES son de: " + respuestaJSON[i].nombre+ " " + respuestaJSON[i].apellidos;
                            content.push({text : cadena[i], background : "#8288c3", color : "white", margin : [25,0,0,0]});
                        }

                        if(respuestaJSON[i].total_sancion_amon){
                            parrafo.style.position = "relative";
                            parrafo.style.left = "15%";

                            parrafo.innerHTML = respuestaJSON[i].total_sancion_amon + " SANCIONES DERIVADAS DE AMONESTACIONES son de: " + respuestaJSON[i].nombre+ " " + respuestaJSON[i].apellidos;
                            cadena[i] = respuestaJSON[i].total_sancion_amon + " SANCIONES DERIVADAS DE AMONESTACIONES son de: " + respuestaJSON[i].nombre+ " " + respuestaJSON[i].apellidos;
                            content.push({text : cadena[i], background : "#8288c3", color : "white", margin : [25,0,0,0]});
                        }

                        if(respuestaJSON[i].total_acumuladas){
                            parrafo.style.position = "relative";
                            parrafo.style.left = "15%";

                            parrafo.innerHTML = respuestaJSON[i].total_acumuladas + " SANCIONES ACUMULADAS son de: " + respuestaJSON[i].nombre+ " " + respuestaJSON[i].apellidos;
                            cadena[i] = respuestaJSON[i].total_acumuladas + " SANCIONES ACUMULADAS son de: " + respuestaJSON[i].nombre+ " " + respuestaJSON[i].apellidos;
                            content.push({text : cadena[i], background : "#8288c3", color : "white", margin : [25,0,0,0]});
                        }


                        if(respuestaJSON[i].total_sanciones){
                            parrafo.style.position = "relative";
                            parrafo.style.left = "15%";

                            parrafo.innerHTML = respuestaJSON[i].total_sanciones + " SANCIONES DIRECTAS son de: " + respuestaJSON[i].nombre+ " " + respuestaJSON[i].apellidos;
                            cadena[i] = respuestaJSON[i].total_sanciones + " SANCIONES DIRECTAS son de: " + respuestaJSON[i].nombre+ " " + respuestaJSON[i].apellidos;
                            content.push({text : cadena[i], background : "#8288c3", color : "white", margin : [25,0,0,0]});
                        }

                    
                    padre.appendChild(parrafo);
                    
                }

                // Ejecuta la función que nos implementa la falta en conjunto a todos los pasos anteriores.
                boton.addEventListener('click', (event) => {
                    
                    var docDefinition = {content: content}
                    pdfMake.createPdf(docDefinition).open();

                }, false);
                
            })
    
            // En caso de error en la Petición con Fetch
            .catch (() => {
                console.log("@Fetch : Error en Listado 3 ")
            }) 

        }

        // ---[PUNTO 5]-------------------------------------------------------------------------------------- //
        // Total de Amonestaciones de todos los Profesores
        // -------------------------------------------------------------------------------------------------- // 

        function listado_total_profesores(){
            
            let padre = document.getElementById("contenedor");
            refrescar(padre); 
            padre.style.height = "500%";

            // ------------------------------ Texto de la Ventana ------------------------------ //

                let titulo = document.createElement("h1");
                titulo.setAttribute("class","titulo_contenedor");
                titulo.innerHTML = "Total de amonestaciones de todos los profesores";
                       
                padre.appendChild(titulo);
                               
            // ------------------------------------------------------------------------------- //

            let boton = document.createElement("button");
            boton.setAttribute("id","botonPDF");
            boton.innerHTML = "Obtener PDF";
            padre.appendChild(boton);

            // Declaración del objeto LISTADOS, donde le mandaremos una cadena identificando que listado recoge el PHP

            LISTADO = {
                listado_cadena : "listado_5",
            }

            // --- Realizamos Petición Asíncrona con Fetch para: Recibir las Causas
            fetch('php/05_listado.php',{
                method : 'POST',
                body   : JSON.stringify(LISTADO),
            })
    
            // --- Recibimos la respuesta del PHP, se trata de un formato JSON
            .then (respuesta => respuesta.json())
    
            // --- Manipulamos el JSON con el JavaScript
            .then ((respuestaJSON) => {
                
                // Para almacenar lo que nos devuelva el JSON
                var cadena = [];
                var content = [];
                content.push({text : "Total de Amonestaciones de todos los Profesores", fontSize : 32})

                let parrafo = document.createElement("p");
                parrafo.setAttribute("id","parrafo_listado");
                
                parrafo.innerHTML = "En total se han puesto: " + respuestaJSON[respuestaJSON.length-1].total_amonestacion + " amonestaciones.";
                padre.appendChild(parrafo);

                cadena[0] = "En total se han puesto: " + respuestaJSON[respuestaJSON.length-1].total_amonestacion + " amonestaciones.";
                content.push({text : cadena[0], background : "#242961", color : "white"});

                for(let i = 0 ; i < respuestaJSON.length-1 ; i++){

                    let parrafo = document.createElement("p");
                    parrafo.setAttribute("id","parrafo_listado");
            
                    if(respuestaJSON[i].total != "1"){
                        parrafo.innerHTML = respuestaJSON[i].total + " amonestaciones de: " + respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos;
                        cadena[i+1] = respuestaJSON[i].total + " amonestaciones de: " + respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos;
                        content.push({text : cadena[i+1], background : "#8288c3", color : "white", margin : [25,0,0,0]});
                    }else{
                        parrafo.innerHTML = respuestaJSON[i].total + " amonestación de: " + respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos;
                        cadena[i+1] = respuestaJSON[i].total + " amonestación de: " + respuestaJSON[i].nombre + " " + respuestaJSON[i].apellidos;
                        content.push({text : cadena[i+1], background : "#8288c3", color : "white", margin : [25,0,0,0]});
                    }

                    padre.appendChild(parrafo);
                    
                }
                // Ejecuta la función que nos implementa la falta en conjunto a todos los pasos anteriores.
                boton.addEventListener('click', (event) => {
                    
                    var docDefinition = {content: content}
                    pdfMake.createPdf(docDefinition).open();

                }, false);

            })
            // En caso de error en la Petición con Fetch
            .catch (() => {
                console.log("@Fetch : Error en Listado 3 ")
            }) 
        }