<?php

  header("Content-Type: application/json");

  require "./repository.php";

  $country = "pl";
  $httpAcceptLanguage = explode(",", $_SERVER["HTTP_ACCEPT_LANGUAGE"]);
  if (isset($httpAcceptLanguage[0])) {
    $country = strtolower(substr(trim($httpAcceptLanguage[0]), 3));
  }

  switch (strtolower(trim($_SERVER["REQUEST_METHOD"]))) {
    case "get":
      get($repository, $country);
      break;
    case "post":
      pot();
      break;
    default:
      pot();
  }

  function get($repository, $country) {
  
    if(isset($_GET["lang"])) {
      $country = strtolower(trim($_GET["lang"]));
    }
    
    //
    $address = trim($_SERVER['REMOTE_ADDR']);
    $client = trim($_SERVER['HTTP_USER_AGENT']);
    $repository -> createVisit($address, $client, $country); 
    //
  
    $selected = trim($_GET["selected"]);
    $result = [];
    if ("" != $selected) {
      $result = $repository -> getSelected($selected);
    }
    else {
      $result = $repository -> getItems($country);
    }
    $list = "[";
    foreach ($result as $row) {
      $list .= "{\"item\": \"${row["PRODUKT"]}\", \"store\": \"${row["SKLEP"]}\", \"price\": ${row["CENA"]}, \"posted\": \"${row["DODANO"]}\", \"coupon\": \"${row["COUPON"]}\", \"bulk\": \"${row["BULK"]}\", \"id\": ${row["ID"]}, \"lowest\": ${row["LOWEST"]}},";
    }
    $list .= "]";
    echo(str_replace(",]", "]", $list));
  }

  function pot() {
    echo("gotcha!");
  }

?>
