<?php

        // -------------------------------------------------------------------------------------------------- //        
        // El fichero consiste los listados dependiendo del botón que presionemos.
   
        // -------------------------------------------------------------------------------------------------- //


    include 'conexionbase.php';


    $texto_JS       = file_get_contents('php://input'); 
    $contenido      = json_decode($texto_JS);

    $listado         = $contenido->{'listado_cadena'};

    if($listado == "listado_1"){
        
        // SACAR EL ALUMNO CON AMONESTACIONES
        $sentencia = mysqli_query($conn,"SELECT dni,nombre,apellidos,nivel,grupo FROM alumnos WHERE dni IN (SELECT alumno FROM control_faltas WHERE codigo_falta LIKE 'AMON_%' AND sancion='no') OR dni IN (SELECT dni FROM resueltas WHERE codigo_falta LIKE 'SAN_%') OR dni IN (SELECT dni FROM resueltas WHERE codigo_falta LIKE 'AMON_%') OR dni IN (SELECT dni FROM resueltas WHERE codigo_falta LIKE 'CONJ_%')");

        while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
            $arrayObjeto[] = $fila;                                   // Array de los Objetos
        }
        
        $contador = count($arrayObjeto);

        $arrayGlobal = [];

        // Sacar Amonestaciones de los Alumno
        for($i = 0 ; $i < $contador ; $i++){
            
            $dni = $arrayObjeto[$i]['dni'];
            array_push($arrayGlobal,$arrayObjeto[$i]);


            // Sacar AMONESTACIONES DE LOS ALUMNOS
            $sentencia = mysqli_query($conn,"SELECT causa, fecha FROM control_faltas WHERE sancion='no' AND alumno = '$dni' AND codigo_falta LIKE 'AMON_%'");

            while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
                array_push($arrayGlobal, $fila);                                   // Array de los Objetos
            }

            // Sacar SANCIONES DIRECTAS DE LOS ALUMNOS
            $sentencia2 = mysqli_query($conn,"SELECT codigo_sancion, fecha_inicio, fecha_fin, descripcion  FROM resueltas WHERE dni = '$dni' AND codigo_falta LIKE 'SAN_%'");

            while($fila = mysqli_fetch_assoc($sentencia2)){                // Genera una fila a fila
                array_push($arrayGlobal, $fila);                                   // Array de los Objetos
            }

            // Sacar SANCIONES ACUMULATIVAS DE LOS ALUMNOS
            $sentencia3 = mysqli_query($conn,"SELECT codigo_sancion, fecha_inicio, fecha_fin, descripcion  FROM resueltas WHERE dni = '$dni' AND codigo_falta LIKE 'CONJ_%'");

            while($fila = mysqli_fetch_assoc($sentencia3)){                // Genera una fila a fila
                array_push($arrayGlobal, $fila);                                   // Array de los Objetos
            }

            // Sacar SANCIONES DE AMONESTACIÓN
            $sentencia4 = mysqli_query($conn,"SELECT codigo_sancion, fecha_inicio, fecha_fin, descripcion  FROM resueltas WHERE dni = '$dni' AND codigo_falta LIKE 'AMON_%'");

            while($fila = mysqli_fetch_assoc($sentencia4)){                // Genera una fila a fila
                array_push($arrayGlobal, $fila);                                   // Array de los Objetos
            }

        }
        

    
        echo json_encode($arrayGlobal);
    }

    if($listado == "listado_2"){
        $sentencia = mysqli_query($conn,"SELECT dni,nombre,apellidos,nivel,grupo FROM alumnos WHERE dni IN (SELECT alumno FROM control_faltas WHERE firma='no')");
        
        while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
            $arrayObjeto[] = $fila;                                   // Array de los Objetos
        }

        $contador = count($arrayObjeto);

        $arrayGlobal = [];

        // Sacar Amonestaciones de los Alumno
        for($i = 0 ; $i < $contador ; $i++){
            
            $dni = $arrayObjeto[$i]['dni'];
            array_push($arrayGlobal,$arrayObjeto[$i]);


            // Sacar pendientes de firma
            $sentencia = mysqli_query($conn,"SELECT causa,asignatura,fecha FROM control_faltas WHERE firma='no' AND alumno='$dni'");

            while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
                array_push($arrayGlobal, $fila);                                   // Array de los Objetos
            }


        }


        echo json_encode($arrayGlobal);
    }

    if($listado == "listado_3"){

        // SACAR LOS PROFESORES Y SU TOTAL
        $sentencia = mysqli_query($conn,"SELECT d.codigo, d.nombre, d.apellidos, COUNT(*) AS total FROM control_faltas c, docentes d WHERE d.codigo = c.profesor AND c.codigo_falta LIKE 'AMON_%' AND sancion='no'
        GROUP BY d.nombre;");

        while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
            $arrayObjeto[] = $fila;                                   // Array de los Objetos
        }
        
        $contador = count($arrayObjeto);

        $arrayGlobal = [];

        // Sacar Amonestaciones de los Alumno
        for($i = 0 ; $i < $contador ; $i++){
            
            $codigo = $arrayObjeto[$i]['codigo'];
            array_push($arrayGlobal,$arrayObjeto[$i]);


            // Sacar AMONESTACIONES DE LOS ALUMNOS
            $sentencia = mysqli_query($conn,"SELECT nombre,apellidos,nivel,grupo FROM alumnos WHERE dni IN (SELECT alumno FROM control_faltas WHERE codigo_falta LIKE 'AMON_%' AND sancion = 'no' AND profesor IN (SELECT codigo FROM docentes WHERE codigo = '$codigo')
            GROUP BY alumno)");

            while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
                array_push($arrayGlobal, $fila);                                   // Array de los Objetos
            }


        }
        

    
        echo json_encode($arrayGlobal);

    }

    if($listado == "listado_4"){
        // SACAMOS EL TOTAL DE NIVEL Y GRUPO --> Total de Amonestaciones y Sanciones Acumuladas
        $sentencia = mysqli_query($conn,"SELECT a.nivel, a.grupo, COUNT(*) AS total FROM alumnos a, control_faltas c
        WHERE a.dni = c.alumno
        GROUP BY nivel,grupo");

        while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
            $arrayObjeto[] = $fila;                                   // Array de los Objetos
        }
        
        $contador = count($arrayObjeto);

        $arrayGlobal = [];

        // Sacar Amonestaciones de los Alumno
        for($i = 0 ; $i < $contador ; $i++){
            
            $nivel = $arrayObjeto[$i]['nivel'];
            $grupo = $arrayObjeto[$i]['grupo'];

            array_push($arrayGlobal,$arrayObjeto[$i]);

            // Sacar AMONESTACIONES 
            $sentencia = mysqli_query($conn,
            "SELECT a.nombre, a.apellidos, a.nivel, a.grupo, COUNT(*) AS total_amonestaciones FROM alumnos a, control_faltas c
            WHERE a.dni = c.alumno AND a.grupo = '$grupo' AND a.nivel = '$nivel' AND sancion = 'no'
            GROUP BY a.dni,nivel,grupo");

            while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
                array_push($arrayGlobal, $fila);                                   // Array de los Objetos
            }

            // Sacar SANCIONES ACUMULADAS
            $sentencia2 = mysqli_query($conn,
            "SELECT a.nombre, a.apellidos, a.nivel, a.grupo, COUNT(*) AS total_acumuladas FROM alumnos a, resueltas r
            WHERE a.dni = r.dni AND r.codigo_falta LIKE 'CONJ_%' AND a.grupo = '$grupo' AND a.nivel = '$nivel'
            GROUP BY a.dni,nivel,grupo");

            while($fila = mysqli_fetch_assoc($sentencia2)){                // Genera una fila a fila
                array_push($arrayGlobal, $fila);                                   // Array de los Objetos
            }


            // Sacar SANCIONES DIRECTAS
            $sentencia3 = mysqli_query($conn,
            "SELECT a.nombre, a.apellidos, a.nivel, a.grupo, COUNT(*) AS total_sanciones FROM alumnos a, resueltas r
            WHERE a.dni = r.dni AND r.codigo_falta LIKE 'SAN_%' AND a.grupo = '$grupo' AND a.nivel = '$nivel'
            GROUP BY a.dni,nivel,grupo");

            while($fila = mysqli_fetch_assoc($sentencia3)){                // Genera una fila a fila
                array_push($arrayGlobal, $fila);                                   // Array de los Objetos
            }

            // Sacar SANCIONES AMONESTACIONES
            $sentencia4 = mysqli_query($conn,
            "SELECT a.nombre, a.apellidos, a.nivel, a.grupo, COUNT(*) AS total_sancion_amon FROM alumnos a, resueltas r
            WHERE a.dni = r.dni AND r.codigo_falta LIKE 'AMON_%' AND a.grupo = '$grupo' AND a.nivel = '$nivel'
            GROUP BY a.dni,nivel,grupo");

            while($fila = mysqli_fetch_assoc($sentencia4)){                // Genera una fila a fila
                array_push($arrayGlobal, $fila);                                   // Array de los Objetos
            }



        }
        
        echo json_encode($arrayGlobal);

    }

    if($listado == "listado_5"){

        $sentencia = mysqli_query($conn,"SELECT d.nombre, d.apellidos, COUNT(*) AS total FROM control_faltas c, docentes d WHERE d.codigo = c.profesor AND c.codigo_falta LIKE 'AMON_%' AND sancion='no'
        GROUP BY d.nombre");
        
        while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
            $arrayObjeto[] = $fila;                                   // Array de los Objetos
        }

        $sentencia2 = mysqli_query($conn,"SELECT COUNT(*) AS total_amonestacion FROM control_faltas c WHERE c.codigo_falta LIKE 'AMON_%' AND sancion='no'");
        $fila2 = mysqli_fetch_assoc($sentencia2);
        $arrayObjeto[] = $fila2;

        echo json_encode($arrayObjeto);

    }
   

?>