<?php
    var_dump($_FILES);
    for ($i=0; $i < count($_FILES['file']['tmp_name']); $i++) { 
        if(!$_FILES['file']['error'][$i])
        {
            $fname = "temp".$i.".wav";
            echo $fname.'<br>';
            move_uploaded_file($_FILES['file']['tmp_name'][$i], $fname);
        }
    }
    echo "done";
?>