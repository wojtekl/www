<?php

  header("Content-Type: application/json");

  require "./repository.php";

  $httpLang = explode(",", $_SERVER["HTTP_ACCEPT_LANGUAGE"])[0];
  $country = strtolower(trim($_GET["lang"] ?? isset($httpLang) ? substr($httpLang, strpos($httpLang, '-') + 1) : 'pl'));

  switch (strtolower(trim($_SERVER["REQUEST_METHOD"]))) {
    case "get":
      get($repository, $country);
      break;
    default:
      pot();
  }

  function get($repository, $country) {
    $result = $repository -> readLog();
    $row = $result[0];
    $list = "{\"count\": \"${row["COUNT"]}\"}";
    
    $address = trim($_SERVER['REMOTE_ADDR']);
    $client = trim($_SERVER['HTTP_USER_AGENT']);
    if (isset($address) && isset($client)) {
      $result = $repository -> createLog($address, $client, $country);
    }
    
    echo($list);
  }

  function pot() {
    echo("gotcha!");
  }

?>
