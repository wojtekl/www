<?php

  header("Content-Type: application/json");

  require "./repository.php";

  $country = "pl";
  $httpAcceptLanguage = explode(",", $_SERVER["HTTP_ACCEPT_LANGUAGE"]);
  if (isset($httpAcceptLanguage[0])) {
    $country = strtolower(substr(trim($httpAcceptLanguage[0]), 3));
  }

  if(isset($_GET["lang"])) {
    $country = strtolower(trim($_GET["lang"]));
  }

  switch (strtolower(trim($_SERVER["REQUEST_METHOD"]))) {
    case "get":
      get($repository, $country);
      break;
    case "post":
      post($repository, $country);
      break;
    default:
      pot();
  }

  function get($repository, $country) {
    $result = $repository -> getVisit($country);
    $row = $result[0];
    $list = "{\"address\": \"${row["ADDRESS"]}\",\"client\": \"${row["CLIENT"]}\",\"country\": \"${row["COUNTRY"]}\",\"created\": \"${row["CREATED"]}\"}";
    echo($list);
  }
  
  function post($repository, $country) {
    $address = trim($_SERVER['REMOTE_ADDR']);
    $client = trim($_SERVER['HTTP_USER_AGENT']);
    if (isset($address) && isset($client)) {
      $result = $repository -> createVisit($address, $client, $country);
      echo($result);
    }
  }

  function pot() {
    echo("gotcha!");
  }

?>
