<?php

  $file_name= "data.txt";

  $entries_from_file = file_get_contents($file_name);

  //massiiv olemasolevate purkidega
  $entries = json_decode($entries_from_file);


  if(isset($_GET["id"]) && isset($_GET["title"]) && isset($_GET["injury"]) && !empty($_GET["id"]) && !empty($_GET["title"]) && !empty($_GET["injury"])){

	  //salvestan juurde
	  $object = new StdClass();
	  $object->id = $_GET["id"];
	  $object->title = $_GET["title"];
	  $object->injury = $_GET["injury"];


	  //lisan massiiivi juurde
	  array_push($entries, $object);

	  //teen stringiks
	  $json = json_encode($entries);

	  //salvestan
	  file_put_contents($file_name, $json);

  }


  //var_dump($entries);
	echo(json_encode($entries));



?>
