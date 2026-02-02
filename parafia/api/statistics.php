<?php

  header("Content-Type: application/json");

  require "./repository.php";

  $httpLang = explode(",", $_SERVER["HTTP_ACCEPT_LANGUAGE"])[0];
  $country = strtolower(trim($_GET["lang"] ?? isset($httpLang) ? substr($httpLang, strpos($httpLang, '-')) : 'pl'));

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
    $result = $repository -> readLog();
    $row = $result[0];
    $list = "{\"address\": \"${row["ADDRESS"]}\",\"client\": \"${row["CLIENT"]}\",\"country\": \"${row["COUNTRY"]}\",\"created\": \"${row["CREATED"]}\"}";
    echo($list);
  }
  
  function post($repository, $country) {
    $address = trim($_SERVER['REMOTE_ADDR']);
    $client = trim($_SERVER['HTTP_USER_AGENT']);
    if (isset($address) && isset($client)) {
      $result = $repository -> createLog($address, $client, $country);
      echo($result);
    }
  }

  function pot() {
    echo("gotcha!");
  }

?>
