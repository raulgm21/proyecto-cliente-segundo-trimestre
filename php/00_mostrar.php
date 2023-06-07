<?php

include 'conexionbase.php';

$texto_JS       = file_get_contents('php://input'); 
$contenido      = json_decode($texto_JS);

$mostrar = $contenido->{'mostrar'};

//**************************************************************************************************************//
//------------------------------------------ MOSTRAR NIVEL EDUCATIVO -------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos muestra los niveles educativos del Instituto
        // -------------------------------------------------------------------------------------------------- //

        if($mostrar == "mostrar_nivel_educativo"){

            $sentencia = mysqli_query($conn,"SELECT nivel FROM nivel_educativo");

            while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
            $arrayObjeto[] = $fila;                                         // Array de los Objetos
            }

            echo json_encode($arrayObjeto);
        }

//**************************************************************************************************************//
//----------------------------------------------- MOSTRAR GRUPO ------------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos muestra los grupos del Nivel Educativo seleccionado.
        // -------------------------------------------------------------------------------------------------- //

        if($mostrar == "mostrar_grupo"){

            $nivel = $contenido->{'nivel'};

            $total = mysqli_query($conn,"SELECT COUNT(grupo) FROM grupos WHERE nivel_educativo = '$nivel'");
            foreach($total as $variable){
                foreach($variable as $valor){
                    $numero_grupos = $valor;
                }
            }

            if($numero_grupos == 0){
                echo json_encode("no");
            }else{

                $sentencia = mysqli_query($conn,"SELECT grupo FROM grupos WHERE nivel_educativo = '$nivel'");

                while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
                $arrayObjeto[] = $fila;                                         // Array de los Objetos
                }

                echo json_encode($arrayObjeto);
            }
            
        }

//**************************************************************************************************************//
//---------------------------------------------- MOSTRAR ALUMNOS -----------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos muestro los alumnos del grupo seleccionado.
        // -------------------------------------------------------------------------------------------------- //

        if($mostrar == "mostrar_alumnos"){

            $nivel          = $contenido->{'alumnos_nivel'};
            $grupo          = $contenido->{'alumnos_grupo'};
        
            // Si el NIVEL EDUCATIVO tiene MÁS de un grupo
            if($grupo != "no"){
                $sentencia = mysqli_query($conn,"SELECT dni,nombre,apellidos,imagen FROM alumnos WHERE nivel='$nivel' AND grupo='$grupo'");
        
                $existe = mysqli_query($conn,"SELECT COUNT(*) FROM alumnos WHERE nivel='$nivel' AND grupo='$grupo'");
        
                foreach($existe as $variable){
                    foreach($variable as $valor){
                        $error_grupo = $valor;
                    }
                }
        
            }
            // Si el NIVEL EDUCATIVO tiene UN único grupo
            else{
                $sentencia = mysqli_query($conn,"SELECT dni,nombre,apellidos,imagen FROM alumnos WHERE nivel='$nivel'");
            
                $existe = mysqli_query($conn,"SELECT COUNT(*) FROM alumnos WHERE nivel='$nivel'");
            
                foreach($existe as $variable){
                    foreach($variable as $valor){
                        $error_grupo = $valor;
                    }
                }
        
            }
        
            if($error_grupo != 0){
                while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
                    $arrayObjeto[] = $fila;                                   // Array de los Objetos
                }
                echo json_encode($arrayObjeto);
            }else{
                echo json_encode("error");
            }

        }

//**************************************************************************************************************//
//-------------------------------------------- MOSTRAR ASIGNATURAS ---------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos muestra las asignaturas del alumno seleccionado.
        // -------------------------------------------------------------------------------------------------- //

        if($mostrar == "mostrar_asignaturas"){

            $texto_JS       = file_get_contents('php://input'); 
            $contenido      = json_decode($texto_JS);

            $dni            = $contenido->{'alumnos_dni'};

            $sentencia = mysqli_query($conn,"SELECT nombre,imagen FROM asignaturas WHERE codigo IN (SELECT codigo_asignatura FROM alumnos_asignaturas WHERE dni_alumno = '$dni')");

                while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
                    $arrayObjeto[] = $fila;                                   // Array de los Objetos
                }

            echo json_encode($arrayObjeto);

        }

//**************************************************************************************************************//
//----------------------------------------------- MOSTRAR CAUSAS -----------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos muestra las causas disponibles.
        // -------------------------------------------------------------------------------------------------- //

        if($mostrar == "mostrar_causas"){

            $tipo           = $contenido->{'causas_tipo'};

            if($tipo == "amonestacion"){

                $sentencia = mysqli_query($conn,"SELECT codigo,causa FROM amonestacion");

                while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
                    $arrayObjeto[] = $fila;                                   // Array de los Objetos
                }

                echo json_encode($arrayObjeto);

            }else{

                $sentencia = mysqli_query($conn,"SELECT codigo,causa FROM expulsion_calle");

                while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
                    $arrayObjeto[] = $fila;                                   // Array de los Objetos
                }

                echo json_encode($arrayObjeto);

            }

        }

//**************************************************************************************************************//
//------------------------------------------------ CREAR CAUSAS ------------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos permite crear nuevas causas.
        // -------------------------------------------------------------------------------------------------- //
        
        if($mostrar == "crear_causas"){

            $tipo           = $contenido->{'peticion_tipo'};
            $causa          = $contenido->{'peticion_causa'};

            $causa = trim($causa);                  // Elimina espacios antes y después de los datos
            $causa = stripslashes($causa);          // Elimina backslashes \ 
            $causa = htmlspecialchars($causa);      // Traduce caracteres especiales en entidades HTML

            if($causa != ""){

                // Para crear una AMONESTACIÓN
                if($tipo == "amonestacion"){

                    $sentencia = mysqli_query($conn,"SELECT COUNT(*) FROM amonestacion");

                    foreach($sentencia as $variable){
                        foreach($variable as $valor){
                            $numero_amonestaciones = $valor;
                        }
                    }

                    $numero_amonestaciones++;

                    if($numero_amonestaciones >= 10){
                        $codigo_causa = "AM_".strval($numero_amonestaciones);
                    }else{
                        $codigo_causa = "AM_0".strval($numero_amonestaciones);
                    }
                    

                    $sentencia = mysqli_query($conn,"INSERT INTO amonestacion VALUES ('$numero_amonestaciones','$codigo_causa','$causa')");

                    echo json_encode($codigo_causa);

                // Para crear una EXPULSIÓN DE CALLE
                }else{

                    $sentencia = mysqli_query($conn,"SELECT COUNT(*) FROM expulsion_calle");

                    foreach($sentencia as $variable){
                        foreach($variable as $valor){
                            $numero_expulsion = $valor;
                        }
                    }

                    $numero_expulsion++;
                    if($numero_expulsion >= 10){
                        $codigo_causa = "EX_".strval($numero_expulsion);
                    }else{
                        $codigo_causa = "EX_0".strval($numero_expulsion);
                    }
                    

                    $sentencia = mysqli_query($conn,"INSERT INTO expulsion_calle VALUES ('$numero_expulsion','$codigo_causa','$causa')");

                    echo json_encode($codigo_causa);

                }
            
            }else{
                $texto = "vacio";
                echo json_encode($texto);
            }

        }

//**************************************************************************************************************//
//------------------------------------------------ CREAR MOTIVO ------------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos permite crear nuevas causas.
        // -------------------------------------------------------------------------------------------------- //
        
        if($mostrar == "crear_motivo_sancion"){

            $tipo           = $contenido->{'peticion_tipo'};
            $causa          = $contenido->{'peticion_causa'};

            $causa = trim($causa);                  // Elimina espacios antes y después de los datos
            $causa = stripslashes($causa);          // Elimina backslashes \ 
            $causa = htmlspecialchars($causa);      // Traduce caracteres especiales en entidades HTML

            if($causa != ""){

                $sentencia = mysqli_query($conn,"SELECT COUNT(*) FROM sancion");

                    foreach($sentencia as $variable){
                        foreach($variable as $valor){
                            $numero_sanciones = $valor;
                        }
                    }

                    $numero_sanciones++;

                    if($numero_sanciones >= 10){
                        $codigo_causa = "SA_".strval($numero_sanciones);
                    }else{
                        $codigo_causa = "SA_0".strval($numero_sanciones);
                    }
                    

                $sentencia = mysqli_query($conn,"INSERT INTO sancion VALUES ('$codigo_causa','$causa')");

                echo json_encode($codigo_causa);

               
            
            }else{
                $texto = "vacio";
                echo json_encode($texto);
            }

        }

//**************************************************************************************************************//
//------------------------------------------------ CREAR MEDIDA ------------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos permite crear nuevas causas.
        // -------------------------------------------------------------------------------------------------- //
        
        if($mostrar == "crear_medida_correctora"){

            $tipo           = $contenido->{'peticion_tipo'};
            $causa          = $contenido->{'peticion_causa'};

            $causa = trim($causa);                  // Elimina espacios antes y después de los datos
            $causa = stripslashes($causa);          // Elimina backslashes \ 
            $causa = htmlspecialchars($causa);      // Traduce caracteres especiales en entidades HTML

            if($causa != ""){

                $sentencia = mysqli_query($conn,"SELECT COUNT(*) FROM medidas_correctoras");

                    foreach($sentencia as $variable){
                        foreach($variable as $valor){
                            $numero_sanciones = $valor;
                        }
                    }

                    $numero_sanciones++;

                    if($numero_sanciones >= 10){
                        $codigo_causa = "ME_".strval($numero_sanciones);
                    }else{
                        $codigo_causa = "ME_0".strval($numero_sanciones);
                    }
                    

                $sentencia = mysqli_query($conn,"INSERT INTO medidas_correctoras VALUES ('$codigo_causa','$causa')");

                echo json_encode($codigo_causa);

               
            
            }else{
                $texto = "vacio";
                echo json_encode($texto);
            }

        }

//**************************************************************************************************************//
//----------------------------------------------- MOSTRAR RESUMEN ----------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos muestra un resumen antes de crear la falta.
        // -------------------------------------------------------------------------------------------------- //
        
        if($mostrar == "mostrar_resumen"){

        $tipo           = $contenido->{'resumen_tipo'};
        $codigo         = $contenido->{'resumen_codigo'};
        $dni            = $contenido->{'resumen_dni'};
        $asignatura     = $contenido->{'resumen_asignatura'};
    
        // Sacamos el motivo
        if($tipo == "amonestacion"){
            $sentencia = mysqli_query($conn,"SELECT causa FROM amonestacion WHERE codigo='$codigo'");
    
            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $motivo = $valor;
                }
            }
    
        }else{
            $sentencia = mysqli_query($conn,"SELECT causa FROM expulsion_calle WHERE codigo='$codigo'");
    
            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $motivo = $valor;
                }
            }
        }
        
    
    
        // Sacamos el nombre
        $sentencia = mysqli_query($conn,"SELECT nombre FROM alumnos WHERE dni='$dni'");
    
        foreach($sentencia as $variable){
            foreach($variable as $valor){
                $nombre = $valor;
            }
        }
    
        // Sacamos el apellido
        $sentencia = mysqli_query($conn,"SELECT apellidos FROM alumnos WHERE dni='$dni'");
    
        foreach($sentencia as $variable){
            foreach($variable as $valor){
                $apellidos = $valor;
            }
        }
    
        class RESUMEN{
            public $motivo      = "";
            public $nombre      = "";
            public $apellidos   = "";
            public $asignatura  = "";
        }
    
        $OBJETO = new RESUMEN();
    
        $OBJETO->motivo      = $motivo;
        $OBJETO->nombre      = $nombre;
        $OBJETO->apellidos   = $apellidos;
        $OBJETO->asignatura  = $asignatura;
    
           
        echo json_encode($OBJETO);

        }
?>