<?php
  header("Content-Type: application/json");

  $httpLang = explode(",", $_SERVER["HTTP_ACCEPT_LANGUAGE"])[0];
  $country = strtolower(trim($_GET["lang"] ?? isset($httpLang) ? substr($httpLang, strpos($httpLang, '-') + 1) : 'pl'));

  require "./repository.php";

  switch (strtolower(trim($_SERVER["REQUEST_METHOD"]))) {
    case "get":
      get($repository, $country);
      break;
    default:
      pot();
  }

  function get($repository, $country) {
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
