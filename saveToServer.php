<?php

    //$term = json_decode($_GET["term"]);
    //$term = $_GET["term"];

    if(!empty($_POST['data'])){
        $data = $_POST['data'];
        $fname = "test.txt";

        $file = fopen($fname, 'w');//creates new file
        fwrite($file, $data);
        fclose($file);
    }
?>