<?php
  header("Content-Type: application/json");

  if (!isset($_SESSION)) {
    session_start();
  }
  $tenant = $_SESSION["tenant"];
  if (!isset($tenant)) {
    pot();
  }

  require "./repository.php";

  switch (strtolower(trim($_SERVER["REQUEST_METHOD"]))) {
    case "get":
      get($repository, $tenant);
      break;
    case "post":
      post($repository, $tenant);
      break;
    default:
      pot();
  }

  function get($repository, $tenant) {
    $id = trim($_GET["id"]);
    if (!isset($id)) {
      pot();
    }
      
    
    $e = ($repository -> readEventById($id, $tenant))[0];
    
    $toJson = "{\"description\": \"${e["DESCRIPTION"]}\", \"starting\": \"${e["STARTING"]}\", \"period\": \"${e["PERIOD"]}\", \"notes\": \"${e["NOTES"]}\", \"confirmed\": ${e["CONFIRMED"]}, \"type\": \"${e["TYPE"]}\"}";
    echo($toJson);
  }

  function post($repository, $tenant) {
    $description = trim($_POST["description"]);
    $starting = trim($_POST["starting"]);
    $period = trim($_POST["period"]);
    $type = trim($_POST["type"]);
    $notes = trim($_POST["notes"]);
    $confirmed = trim($_POST["confirmed"]) ? 1 : 0;
    $address = "";
    $id = trim($_POST["id"]);
    if (!isset($id) || !isset($starting)) {
      pot();
    }

    $result = $repository -> updateEvent($description, $starting, $period, $type, $notes, $confirmed, $address, $id, $tenant);
    echo($result[0]);
  }

  function pot() {
    echo("gotcha!");
  }
?>
