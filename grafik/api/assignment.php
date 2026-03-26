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
    $eventId = trim($_GET["eventId"]);
    if (!isset($eventId)) {
      pot();
    }
      
    
    $result = $repository -> readAssignmentByEventId($eventId);
    $toJson = "[";
    foreach ($result as $a) {
      $toJson .= "{\"clientId\": ${a["CLIENT_ID"]},\"accepted\": ${a["ACCEPTED"]}},";
    }
    $toJson .= "]";
    $toJson = (str_replace(",]", "]", $toJson));
    
    echo($toJson);
  }

  function post($repository) {
    $client = trim($_POST["client"]);
    $tenant = trim($_POST["tenant"]);
    $groupPassword = trim($_POST["groupPassword"]);
    
    if (!isset($client) || !isset($tenant) || !isset($groupPassword)) {
      pot();
    }
    
    $hash = (($repository -> readGroupPassword($tenant))[0])["GROUPPASSWORD"];
    if (!password_verify($groupPassword, $hash)) {
      session_destroy();
      pot();
      return;
    }
    
    $result = $repository -> readClientByName($client);
    $clientId = 0 < count($result) ? $result[0]["ID"] : $repository -> createClient($client, $client);
    $_SESSION["clientId"] = $clientId;
    $_SESSION["tenant"] = $tenant;
    $toJson = "{\"clientId\": ${clientId}, \"tenant\": \"${tenant}\"}";
    echo($toJson);
  }

  function pot() {
    echo("gotcha!");
  }
?>
