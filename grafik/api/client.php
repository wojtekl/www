<?php
  header("Content-Type: application/json");

  if (!isset($_SESSION)) {
    session_start();
  }

  require "./repository.php";

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
    if (empty($_SESSION["clientId"]) || empty($_SESSION["group"])) {
      echo("");
      return;
    }
    
    $toJson = "{\"id\": ${_SESSION["clientId"]}, \"tenant\": \"${_SESSION["group"]}\"}";
    echo($toJson);
  }

  function post($repository) {
    $client = trim($_POST["client"]);
    $tenant = trim($_POST["tenant"]);
    $groupPassword = trim($_POST["groupPassword"]);
    
    if (empty($client) || empty($tenant) || empty($groupPassword)) {
      pot();
      return;
    }
    
    $hash = (($repository -> readGroupPassword($tenant))[0])["GROUPPASSWORD"];
    if (!password_verify($groupPassword, $hash)) {
      pot();
      return;
    }
    
    $result = $repository -> readClientByName($client);
    $clientId = 0 < count($result) ? $result[0]["ID"] : $repository -> createClient($client, $client);
    $_SESSION["clientId"] = $clientId;
    $_SESSION["group"] = $tenant;
    $toJson = "{\"id\": ${clientId}, \"tenant\": \"${tenant}\"}";
    echo($toJson);
  }

  function pot() {
    session_destroy();
    http_response_code(401);
    echo("gotcha!");
  }
?>
