<?php

    include 'conexionbase.php';

    $texto_JS       = file_get_contents('php://input'); 
    $contenido      = json_decode($texto_JS);

    $pendiente      = $contenido->{'tipo_pendiente'};

//**************************************************************************************************************//
//-------------------------------------------- MOSTRAR PENDIENTES ----------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos muestra si tiene el alumno, sus amonestaciones pendientes.
        // -------------------------------------------------------------------------------------------------- //

        if($pendiente == "mostrar_pendientes"){

            $dni            = $contenido->{'alumnos_dni'};

            $sentencia = mysqli_query($conn,"SELECT COUNT(*) FROM control_faltas WHERE alumno='$dni' AND firma='no' AND sancion='no'");

            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $total = $valor;
                }
            }


            // El alumno no tiene ninguna amonestación pendiente de firma
            if($total == 0){

                echo json_encode($total);

            // El alumno tiene una o varias amonestaciones pendiente de ifrma
            }else{

                $sentencia = mysqli_query($conn,"SELECT causa,asignatura,fecha FROM control_faltas WHERE firma='no' AND sancion='no' AND alumno='$dni'");

                while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
                    $arrayObjeto[] = $fila;                                   // Array de los Objetos
                }

                echo json_encode($arrayObjeto);

            }

        }

//**************************************************************************************************************//
//-------------------------------------------- FIRMAR PENDIENTES -----------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos permite firmar las amonestaciones que seleccionamos del alumno.
        // -------------------------------------------------------------------------------------------------- //
        
        if($pendiente == "firmar_pendientes"){

            // Array o Cadena de Amonestaciones
            $amonestaciones = $contenido->{'alumnos_firmar'};

            // DNI
            $dni = $contenido->{'alumnos_dni'};

            // Variables Auxiliares
            $codigo = "";
            $array = [];
        
            // Hemos seleccionado al menos una amonestación
            if(count($amonestaciones) >= 1){

                // Sacamos los codigos de las faltas de los que hemos seleccionado
                for($i = 0; $i < count($amonestaciones) ; $i++){
                    
                    if($amonestaciones[$i] == true){

                        $total = $i+1;
                        // Seleccionamos la fila de la amonestación seleccionada
                        $fila_seleccionada = mysqli_query($conn,
                        "SELECT codigo_falta
                        FROM
                        (
                        SELECT ROW_NUMBER() OVER (ORDER BY codigo_falta) AS Orden, codigo_falta
                        FROM control_faltas WHERE alumno = '$dni' AND firma='no'
                        ) T1
                        WHERE Orden = '$total'"
                        );
                        // Metemos el código de esta, en un array.
                        foreach($fila_seleccionada as $variable){
                            foreach($variable as $valor){
                                $array[] = $valor;
                            }
                        }
                    }

                }

                // Actualizamos el control de faltas, con las firmadas
                for($i = 0; $i < count($array) ; $i++){
                    
                    $codigo_falta = $array[$i];

                    $sentencia = mysqli_query($conn,"UPDATE control_faltas SET firma='si' WHERE codigo_falta = '$codigo_falta'");

                }

                echo json_encode("correcto");

            }else{
                echo json_encode("todoFalse");
            }   

        }
    
?>