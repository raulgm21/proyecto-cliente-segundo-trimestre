<?php

    include 'conexionbase.php';

        // -------------------------------------------------------------------------------------------------- //
        // El fichero en insertar una falta en control_faltas, tras realizar una amonestación o expulsión.
        // La llamada se hace en la función: implementar_falta
        // -------------------------------------------------------------------------------------------------- //

    // Recogemos el código del Profesor
    session_start();
    $codigo_profesor = $_SESSION['codigo'];

    $texto_JS       = file_get_contents('php://input'); 
    $contenido      = json_decode($texto_JS);

    // Tenemos el código. Queremos pasarlo a Motivo ❌
    $causa          = $contenido->{'falta_causa'};
    // Tenemos el nombre. Necesitamos el codigo. ✅
    $asignatura     = $contenido->{'falta_asignatura'};
    // Tenemos el dni. ✅
    $dni            = $contenido->{'falta_dni'};
    // Tenemos la fecha. ✅
    $fecha          = $contenido->{'falta_fecha'};
    
    // Tenemos la fecha. ✅
    $tipo           = $contenido->{'falta_tipo'};

    if($tipo == "amonestacion"){

        // Sacar el motivo de la causa
        $sentencia = mysqli_query($conn,"SELECT causa FROM amonestacion WHERE codigo='$causa'");
        foreach($sentencia as $variable){
            foreach($variable as $valor){
                $motivo_causa = $valor;
            }
        }

        // Cuantas faltas hay actualmente, para calcular el codigo_falta

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


    }else{

        // Sacar el motivo de la causa
        $sentencia = mysqli_query($conn,"SELECT causa FROM expulsion_calle WHERE codigo='$causa'");
        foreach($sentencia as $variable){
            foreach($variable as $valor){
                $motivo_causa = $valor;
            }
        }

        // Cuantas faltas hay actualmente, para calcular el codigo_falta

        $sentencia = mysqli_query($conn,"SELECT COUNT(*) FROM control_faltas WHERE codigo_falta LIKE 'EXPU_%'");
        foreach($sentencia as $variable){
            foreach($variable as $valor){
                $numero_faltas = $valor;
            }
        }

        $numero_faltas++;

        if($numero_faltas >= 100){
            $codigo_faltas = "EXPU_".strval($numero_faltas);
        }else{
            if($numero_faltas >= 10){
                $codigo_faltas = "EXPU_0".strval($numero_faltas);
            }else{
                $codigo_faltas = "EXPU_00".strval($numero_faltas);
            }
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

    

    // ---- Lista para implementar la falta --- //
    // --> ✅ codigo_falta ($codigo_faltas)
    // --> ✅ causa_falta  ($causa)
    // --> ✅ nivel_educativo ($nivel_educativo)
    // --> ✅ asignatura ($codigo_asignatura)
    // --> ✅ alumno  ($dni)
    // --> 💠 profesor ($codigo_profesor)
    // --> ✅ fecha  ($fecha)
    // --> 💠 firma 
    // --> 💠 sancion

    //  Tenemos todo para implementar la FALTA en la BDD

    $sentencia = mysqli_query($conn,"INSERT INTO control_faltas VALUES 
    ('$codigo_faltas','$motivo_causa','$nivel_educativo','$asignatura','$dni','$codigo_profesor','$fecha','no','no')");

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

    //Import PHPMailer classes into the global namespace
    //These must be at the top of your script, not inside a function
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    require 'Composer/vendor/autoload.php';
    //Create an instance; passing `true` enables exceptions
    $mail = new PHPMailer(true);
    try {
        //Server settings
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
        $mail->isSMTP();                                            //Send using SMTP
        $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
        $mail->Username   = "raulgomeeez21@gmail.com";                     //SMTP username
        $mail->Password   = 'frnslfimulbxfdbr';                               //SMTP password
        // Correo principal: frnslfimulbxfdbr
        // Otro correo mío : iiqvcioflmaznriv
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
        $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

        //Recipients
        $mail->setFrom('jefatura@gmail.com', 'Jefatura de Estudios');
        $mail->addAddress($correo);

        //Content
        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = 'Jefatura de Estudios';
        $mail->Body    = 'Buenos días, le avisamos que su hij@ '.$nombre." ".$apellido. " ha tenido una ". $tipo. " por: " .$motivo_causa . " en la asignatura de " . $asignatura . ". <br>Espero que se le sea informado sobre su comportamiento, un saludo";
        $mail->AltBody = 'Buenos días, le avisamos que su hij@ '.$nombre." ".$apellido. " ha tenido una ". $tipo. " por: " .$motivo_causa . " en la asignatura de " . $asignatura . ". Espero que se le sea informado sobre su comportamiento, un saludo";
        $mail->send();
        
    } catch (Exception $e) {
    }

    echo json_encode("correcto");

?>