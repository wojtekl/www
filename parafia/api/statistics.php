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

  function get($repository) {
    //$result = $repository -> readLog();
    //$row = $result[0];
    //$list = "{\"address\": \"${row["ADDRESS"]}\",\"client\": \"${row["CLIENT"]}\",\"country\": \"${row["COUNTRY"]}\",\"created\": \"${row["CREATED"]}\"}";
    //echo($list);
    echo $_SERVER["HTTP_ACCEPT_LANGUAGE"];
    echo explode(",", $_SERVER["HTTP_ACCEPT_LANGUAGE"]);
  }
  
  function post($repository) {
    $address = trim($_SERVER['REMOTE_ADDR']);
    $client = trim($_SERVER['HTTP_USER_AGENT']);
    $country = trim($httpAcceptLanguage[0]), 3);
    if (isset($address) && isset($client)) {
      $result = $repository -> createLog($address, $client, $country);
      echo($result);
    }
  }

  function pot() {
    echo("gotcha!");
  }

?>
