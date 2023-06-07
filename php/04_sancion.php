<?php

    include 'conexionbase.php';

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    require 'Composer/vendor/autoload.php';


    // Recogemos el código del profesor
    session_start();
    $codigo_profesor = $_SESSION['codigo'];

    $texto_JS       = file_get_contents('php://input'); 
    $contenido      = json_decode($texto_JS);

    $sancion = $contenido->{'sancion_tipo'};

//**************************************************************************************************************//
//--------------------------------------- MOSTRAR AMONESTACION SANCION -----------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos muestra un listado de las amonestaciones del alumnos para hacer un cúmulo de amonestaciones.
        // -------------------------------------------------------------------------------------------------- //

        if($sancion == "mostrar_amonestacion_sancion"){

            $dni            = $contenido->{'alumnos_dni'};

            $sentencia = mysqli_query($conn,"SELECT COUNT(*) FROM control_faltas WHERE alumno='$dni'");

            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $total = $valor;
                }
            }

            if($total == 0){

                echo json_encode($total);

            }else{

                $sentencia = mysqli_query($conn,"SELECT causa,asignatura,fecha FROM control_faltas WHERE sancion='no' AND codigo_falta LIKE 'AMON_%' AND alumno='$dni' AND causa IN (SELECT causa FROM amonestacion)");

                while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
                    $arrayObjeto[] = $fila;                                   // Array de los Objetos
                }

                echo json_encode($arrayObjeto);

            }
        }

//**************************************************************************************************************//
//------------------------------------- MOSTRAR CONTENIDO SANCION ----------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos muestra los motivos de sanción y las medidas correctoras.
        // -------------------------------------------------------------------------------------------------- //

        if($sancion == "mostrar_contenido_sancion"){

            $sentencia = mysqli_query($conn,"SELECT * FROM sancion");

            while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
                $arrayObjeto[] = $fila;                                   // Array de los Objetos
            }

            $sentencia = mysqli_query($conn,"SELECT * FROM medidas_correctoras");

            while($fila = mysqli_fetch_assoc($sentencia)){                // Genera una fila a fila
                $arrayObjeto[] = $fila;                                   // Array de los Objetos
            }


            echo json_encode($arrayObjeto);
        }

//**************************************************************************************************************//
//----------------------------------------------- SANCIÓN DIRECTA ----------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos crea una sanción directa.    
        // -------------------------------------------------------------------------------------------------- //

        if($sancion == "directa"){

            // Dni
            $dni = $contenido->{'alumnos_dni'};

            // Motivo de la Sancion
            $motivo_sancion = $contenido->{'alumnos_sancion'};

            // Obtenemos el Código de la Sanción
            $sentencia = mysqli_query($conn,"SELECT codigo FROM sancion WHERE motivo='$motivo_sancion'");

            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $codigo_sancion = $valor;
                }
            }
            
            // Motivo de la Medidas
            $motivo_medidas = $contenido->{'alumnos_medidas'};

            // Obtenemos el Código de la Medida
            $sentencia = mysqli_query($conn,"SELECT codigo FROM medidas_correctoras WHERE motivo='$motivo_medidas'");

            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $codigo_medidas = $valor;
                }
            }

            // Descripcion
            $descripcion = $contenido->{'alumnos_descripcion'};

            // Fecha Comienzo
            $fecha_c = $contenido->{'alumnos_fecha_c'};

            // Fecha Final
            $fecha_f = $contenido->{'alumnos_fecha_f'};
            

            // Cuantas faltas hay actualmente, para calcular el codigo_falta
            $sentencia = mysqli_query($conn,"SELECT COUNT(*) FROM resueltas WHERE codigo_falta LIKE 'SAN_%'");
            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $numero_faltas = $valor;
                }
            }

            $numero_faltas++;

            if($numero_faltas >= 100){
                $codigo_faltas = "SAN_".strval($numero_faltas);
            }else{
                if($numero_faltas >= 10){
                    $codigo_faltas = "SAN_0".strval($numero_faltas);
                }else{
                    $codigo_faltas = "SAN_00".strval($numero_faltas);
                }
            }

            $ahora = date("Y-m-d");
            // Insertar sancion directa
            $sentencia = mysqli_query($conn,"INSERT INTO resueltas VALUES 
            ('$codigo_faltas','$motivo_sancion','$codigo_medidas','$fecha_c','$fecha_f','$descripcion','$dni','$codigo_profesor','$ahora')");
                        
        }
    
//**************************************************************************************************************//
//------------------------------------------- SANCIÓN AMONESTACIÓN ---------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos crea una sanción derivada de amonestación.   
        // -------------------------------------------------------------------------------------------------- //
        
        if($sancion == "amonestacion"){

            // Dni
            $dni = $contenido->{'alumnos_dni'};

            // Array o Cadena de Amonestaciones
            $causa = $contenido->{'alumnos_amonestaciones'};

            $sentencia = mysqli_query($conn,"SELECT causa FROM amonestacion WHERE codigo='$causa'");

            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $motivo_causa = $valor;
                }
            }

            // Motivo de la Sancion
            $motivo_sancion = $contenido->{'alumnos_sancion'};
            
            // Motivo de la Medidas
            $motivo_medidas = $contenido->{'alumnos_medidas'};

            // Obtenemos el Código de la Medida
            $sentencia = mysqli_query($conn,"SELECT codigo FROM medidas_correctoras WHERE motivo='$motivo_medidas'");

            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $codigo_medidas = $valor;
                }
            }

            // Descripcion
            $descripcion = $contenido->{'alumnos_descripcion'};

            // Fecha Comienzo
            $fecha_c = $contenido->{'alumnos_fecha_c'};

            // Fecha Final
            $fecha_f = $contenido->{'alumnos_fecha_f'};
            
            $sentencia = mysqli_query($conn,"SELECT COUNT(*) FROM control_faltas WHERE codigo_falta LIKE 'AMON_%'");
            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $numero_faltas = $valor;
                }
            }

            $numero_faltas++;

            if($numero_faltas >= 100){
                $codigo_faltas = "AMON_".strval($numero_faltas);
            }else{
                if($numero_faltas >= 10){
                    $codigo_faltas = "AMON_0".strval($numero_faltas);
                }else{
                    $codigo_faltas = "AMON_00".strval($numero_faltas);
                }
            }

            // Sacar el nivel educativo
            $sentencia = mysqli_query($conn,"SELECT nivel FROM alumnos WHERE dni='$dni'");
            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $nivel = $valor;
                }
            }
            // Sacar el grupo
            $sentencia = mysqli_query($conn,"SELECT grupo FROM alumnos WHERE dni='$dni'");
            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $grupo = $valor;
                }
            }

            $nivel_educativo = $nivel." ".$grupo;

            // Asignatura
            $asignatura = $contenido->{'alumnos_asignatura'};

            // Insertar amonestacion
            $sentencia = mysqli_query($conn,"INSERT INTO control_faltas VALUES 
            ('$codigo_faltas','$motivo_causa','$nivel_educativo','$asignatura','$dni','$codigo_profesor','$fecha_c','si','si')");

            $ahora = date("Y-m-d");
            // Insertar sancion amonestacion
            $sentencia = mysqli_query($conn,"INSERT INTO resueltas VALUES 
            ('$codigo_faltas','Proviene de Amonestación','$codigo_medidas','$fecha_c','$fecha_f','$descripcion','$dni','$codigo_profesor','$ahora')");
                        
        }

//**************************************************************************************************************//
//--------------------------------------------- SANCIÓN ACUMULADA ----------------------------------------------//
//**************************************************************************************************************//

        // -------------------------------------------------------------------------------------------------- //
        // Nos crea una sanción conjunta de las amonestaciones seleccionadas.   
        // -------------------------------------------------------------------------------------------------- //

        if($sancion == "acumulada"){
            // Dni
            $dni = $contenido->{'alumnos_dni'};

            // Array o Cadena de Amonestaciones
            $amonestaciones = $contenido->{'alumnos_amonestaciones'};

            // Motivo de la Sancion
            $motivo_sancion = $contenido->{'alumnos_sancion'};

            // Obtenemos el Código de la Sanción
            $sentencia = mysqli_query($conn,"SELECT codigo FROM sancion WHERE motivo='$motivo_sancion'");

            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $codigo_sancion = $valor;
                }
            }
            
            // Motivo de la Medidas
            $motivo_medidas = $contenido->{'alumnos_medidas'};

            // Obtenemos el Código de la Medida
            $sentencia = mysqli_query($conn,"SELECT codigo FROM medidas_correctoras WHERE motivo='$motivo_medidas'");

            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $codigo_medidas = $valor;
                }
            }

            // Descripcion
            $descripcion = $contenido->{'alumnos_descripcion'};

            // Fecha Comienzo
            $fecha_c = $contenido->{'alumnos_fecha_c'};

            // Fecha Final
            $fecha_f = $contenido->{'alumnos_fecha_f'};
            
            // Variables Auxiliares
            $codigo = "";
            $array = [];
        
            // En caso de que todos tengan un mismo valor
            $esigual = count(array_unique($amonestaciones))===1;

            // Hemos seleccionado al menos una amonestación
            if($esigual == false || count($amonestaciones) >= 1){

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
                        FROM control_faltas WHERE alumno = '$dni' AND sancion='no'
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

                // Contamos el número de código conjunto
                $totalConjunto = mysqli_query($conn,"SELECT MAX(total_conjunto) FROM conjunto_amonestaciones");
                    
                // Metemos el código de esta, en un array.
                foreach($totalConjunto as $variable){
                    foreach($variable as $valor){
                        $numeroConjunto = $valor;
                    }
                }

                if($numeroConjunto == null){
                    $numeroConjunto = 0;
                }

                $numeroConjunto++;
                

                // Actualizamos el control de faltas, e insertamos las sanciones interpuestas
                for($i = 0; $i < count($array) ; $i++){
                    
                    $codigo_falta = $array[$i];

                    $sentencia = mysqli_query($conn,"UPDATE control_faltas SET sancion='si' AND firma='si' WHERE codigo_falta = '$codigo_falta'");

                    // Insertamos conjunto amonestaciones

                    
                    if($numeroConjunto >= 100){
                        $numeroCodigo = "CONJ_".strval($numeroConjunto);
                    }else{
                        if($numeroConjunto >= 10){
                            $numeroCodigo = "CONJ_0".strval($numeroConjunto);
                        }else{
                            $numeroCodigo = "CONJ_00".strval($numeroConjunto);
                        }
                    }

                    $sentencia = mysqli_query($conn,"INSERT INTO conjunto_amonestaciones VALUES('$numeroCodigo','$codigo_falta','$numeroConjunto')");

                }

                $ahora = date("Y-m-d");
                $sentencia = mysqli_query($conn,"INSERT INTO resueltas VALUES 
                ('$numeroCodigo','$motivo_sancion','$codigo_medidas','$fecha_c','$fecha_f','$descripcion','$dni','$codigo_profesor','$ahora')");
                            

            }else{
                echo json_encode("todoFalse");
            }   
            
        }

//**************************************************************************************************************//
//----------------------------------------------- ENVIAR CORREO ------------------------------------------------//
//**************************************************************************************************************//
    
        // -------------------------------------------------------------------------------------------------- //
        // Enviamos un correo dependiendo del tipo de sanción.   
        // -------------------------------------------------------------------------------------------------- //

        if($sancion == "acumulada" || $sancion == "amonestacion" || $sancion == "directa"){

            // *************************************************************************** //
            // **************** DATOS CORREO ******************************************** //
            // *************************************************************************** //

            // Obtenemos el Nombre del Alumno

            $sentencia = mysqli_query($conn,"SELECT nombre FROM alumnos WHERE dni='$dni'");

            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $nombre = $valor;
                }
            }

            // Fecha Comienzo
            $fecha_c = $contenido->{'alumnos_fecha_c'};

            // Fecha Final
            $fecha_f = $contenido->{'alumnos_fecha_f'};

            // Obtenemos el Apellido del Alumno

            $sentencia = mysqli_query($conn,"SELECT apellidos FROM alumnos WHERE dni='$dni'");

            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $apellido = $valor;
                }
            }

            // Obtenemos el Correo del Alumno

            $sentencia = mysqli_query($conn,"SELECT correo FROM alumnos WHERE dni='$dni'");

            foreach($sentencia as $variable){
                foreach($variable as $valor){
                    $correo = $valor;
                }
            }

            // *************************************************************************** //
            // **************** ENVIAR CORREO ******************************************** //
            // *************************************************************************** //

            $mail = new PHPMailer(true);
            try {
                //Server settings
                $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
                $mail->isSMTP();                                            //Send using SMTP
                $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
                $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
                $mail->Username   = "raulgomeeez21@gmail.com";                     //SMTP username
                $mail->Password   = 'frnslfimulbxfdbr';                               //SMTP password
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
                $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

                //Recipients
                $mail->setFrom('jefatura@gmail.com', 'Jefatura de Estudios');
                $mail->addAddress($correo);

                //Content
                $mail->isHTML(true);                                  //Set email format to HTML
                $mail->Subject = 'Jefatura de Estudios';

                if($sancion == "acumulada"){

                    $mail->Body    = 'Buenos días, le avisamos que su hij@ '.$nombre." ".$apellido. " ha tenido una sanción acumulativa por cúmulo de amonestaciones. <br> Más información: " . $descripcion. " <br> La fecha de implatación es de: ".$fecha_c. " al ". $fecha_f .". <br>Espero que se le sea informado sobre su comportamiento, un saludo";
                    $mail->AltBody = 'Buenos días, le avisamos que su hij@ '.$nombre." ".$apellido. " ha tenido una sanción acumulativa por cúmulo de amonestaciones. Espero que se le sea informado sobre su comportamiento, un saludo";
                
                }

                if($sancion == "amonestacion"){

                    $mail->Body    = 'Buenos días, le avisamos que su hij@ '.$nombre." ".$apellido. " ha tenido una sanción derivada de amonestación. <br> Más información: " . $descripcion. " <br> La fecha de implatación es de: ".$fecha_c. " al ". $fecha_f .". <br>Espero que se le sea informado sobre su comportamiento, un saludo";
                    $mail->AltBody = 'Buenos días, le avisamos que su hij@ '.$nombre." ".$apellido. " ha tenido una sanción derivada de amonestación. <br> Más información: " . $descripcion. " <br> La fecha de implatación es de: ".$fecha_c. " al ". $fecha_f .". <br>Espero que se le sea informado sobre su comportamiento, un saludo";

                }

                if($sancion == "directa"){

                    $mail->Body    = 'Buenos días, le avisamos que su hij@ '.$nombre." ".$apellido. " ha tenido una sanción directa por: " .$motivo_sancion . " .<br>Más información sobre la sanción: ". $descripcion . "<br> La fecha de implatación es de: ".$fecha_c. " al ". $fecha_f .". <br>Espero que se le sea informado sobre su comportamiento, un saludo";
                    $mail->AltBody = 'Buenos días, le avisamos que su hij@ '.$nombre." ".$apellido. " ha tenido una sanción directa por: " .$motivo_sancion . " Más información sobre la sanción: ". $descripcion . ". Espero que se le sea informado sobre su comportamiento, un saludo";

                }

                
                $mail->send();
                
            } catch (Exception $e) {
            }

            echo json_encode($fechaActual);

        }
?>