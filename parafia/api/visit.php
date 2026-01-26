<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Content-Type: application/json");

  require "./repository.php";

  $address = strtolower(trim($_SERVER['REMOTE_ADDR']));

  switch (strtolower(trim($_SERVER["REQUEST_METHOD"]))) {
    case "get":
      get($repository);
      break;
    case "post":
      post($repository);
      break;
    default:
      pot();
  }

  function get($repository) {
    $tenant = trim($_GET["tenant"]);
    if (!isset($tenant)) {
      pot();
    }

    $result = $repository -> readVisit($tenant);
    $toList = "[";
    foreach ($result as $e) {
      $toList .= "{\"id\": \"${e["ID"]}\", \"firstname\": \"${e["FIRSTNAME"]}\", \"surname\": \"${e["SURNAME"]}\", \"street\": \"${e["STREET"]}\", \"number\": \"${e["NUMBER"]}\", \"city\": \"${e["CITY"]}\", \"donation\": \"${e["VALUE"]}\", \"created\": \"${e["CREATED"]}\"},";
    }
    $toList .= "]";
    echo(str_replace(",]", "]", $toList));
  }

  function post($repository) {
  }

  function pot() {
    echo("gotcha!");
  }
?>
