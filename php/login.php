<?php

        // -------------------------------------------------------------------------------------------------- //
        // El fichero consiste en iniciar sesión mediante un usuario y contraseña existente en la BDD.
        // La llamada se hace en la función: login
        // -------------------------------------------------------------------------------------------------- //

    include 'conexionbase.php';

    // Creamos Objeto
    class USUARIO {
        public $codigo   = "";
        public $clave = "";
    }

    // Recogemos por POST el contenido del JSON
    $texto_POST  = file_get_contents('php://input');    
    $contenido   = json_decode($texto_POST);            

    // Creamos instancia
    $usuario     = new USUARIO();

    // Llenamos objeto
    $usuario->codigo  = $contenido->{'codigo'};
    $usuario->clave   = $contenido->{'clave'};

    // Variables del objeto para su uso
    $codigo   = $usuario->codigo;
    $clave    = $usuario->clave;

    // Esta sentencia nos dirá si existe el usuario
    $sentencia = mysqli_query($conn,"SELECT COUNT(*) FROM docentes WHERE codigo='$codigo' AND clave='$clave'");

    foreach($sentencia as $variable){
        foreach($variable as $valor){
            $resultadoSesion = $valor; //Si devuelve 1 es que existe el usuario
        }
    }

    // Comprueba si no está vacío y existe
    if(!empty($codigo) && isset($codigo) && !empty($clave) && isset($clave)){  

        // Existe el usuario
        if($resultadoSesion == 1){
            
            $rol = substr($codigo, 0,4);
            session_start();
            $_SESSION['codigo']  = $codigo;
            $_SESSION['rol']     = $rol;

            $mensaje = "correcto";
            echo json_encode($mensaje);

        }else{
            $mensaje = "El usuario o contraseña son incorrectos";
            echo json_encode($mensaje); 
        }

    }else{
        $mensaje = "No puedes dejar un campo vacío";
        echo json_encode($mensaje); 
    }



    

?>