<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proyecto Raul: Home</title>

    <script src="script/index.js"></script>
  <!--  <script src="script/jspdf.min.js"></script>
    <script src="script/jsPDF-1.3.2/jspdf.plugin.autotable.min.js"></script>-->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>

    <link rel="stylesheet" href="style/home.css">
    <link rel="shortcut icon" href="imagenes/icono.ico" type="image/x-icon">

</head>
<body>
    <?php session_start();
    echo "<input style='display : none;' type='text' id='rol' value='$_SESSION[rol]'>";
    ?>

    <!-- PARA ARREGLAR COMPATIBILIDAD CON EL LOGIN-->
    <p id="enviar" style="display : hidden;"></p>

    
    <div class="encabezado_div">
        <img class="encabezado" alt="" src="imagenes/encabezado.png">
        <h1>Control de Faltas del Instituto</h1>
    </div>

    <button class="cerrarsesion"><a href="php/cerrar_sesion.php">Cerrar Sesión</a></button>
    <p id="cargar"></p>
    <div class="menu_div">

        <div>
            <p class="boton_amonestacion">Amonestación</p>
            <img class="boton_amonestacion" class="menu" alt="" src="imagenes/amonestacion.png"> 
        </div>

        <div>
            <p class="boton_expulsion">Expulsión de Clase</p>
            <img class="boton_expulsion" class="menu" alt="" src="imagenes/expulsion.png"> 
        </div>

        <div>
            <p class="boton_firma">Pendiente de Firma</p>
            <img class="boton_firma" class="menu" alt="" src="imagenes/firma.png"> 
        </div>

        <div>
            <p class="boton_sancion_directa">Sanción Directa</p>
            <img class="boton_sancion_directa" class="menu" alt="" src="imagenes/sancionD.png">
        </div>

        <div>
            <p class="boton_sancion_acumulada">Sanción Acumulativa</p>
            <img class="boton_sancion_acumulada" class="menu" alt="" src="imagenes/sancion.png">
        </div>

        <div>
            <p class="boton_listado">Listado</p>
            <img class="boton_listado" class="menu" alt="" src="imagenes/listado.png">
        </div>

    </div>

    <!--DIV MANIPULADO CON DOM-->
    <div id="contenedor"></div>  


    
</body>
</html>