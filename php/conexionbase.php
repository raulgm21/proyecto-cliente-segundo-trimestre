<?php

// ************************************************************* //
// ************ BASE DE DATOS - CREACIÓN Y CONEXIÓN ************ //
// ************************************************************* //   

$servername     = "localhost";
$username       = "root";
$password       = "";
$database       = "control_faltas";

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
    die();
}

// ************************************************************* //
// ************ BASE DE DATOS - CREACIÓN Y CONEXIÓN ************ //
// ************************************************************* //   

?>