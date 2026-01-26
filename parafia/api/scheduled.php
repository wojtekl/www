<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Content-Type: application/json");

  require "./repository.php";

  if (!isset($_SESSION)) {
    session_start();
  }
  $tenant = $_SESSION["tenant"];
  if (!isset($tenant)) {
    pot();
  }

  $address = strtolower(trim($_SERVER['REMOTE_ADDR']));

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
    
    $e = ($repository -> readScheduledById($id, $tenant))[0];
    $toJson = "{\"description\": \"${e["DESCRIPTION"]}\", \"scheduled\": \"${e["SCHEDULED"]}\", \"value\": \"${e["VALUE"]}\", \"notes\": \"${e["NOTES"]}\", \"type\": \"${e["TYPE"]}\"}";
    echo($toJson);
  }

  function post($repository, $tenant) {
    $description = trim($_POST["description"]);
    $scheduled = trim($_POST["scheduled"]);
    $value = trim($_POST["value"]);
    $type = trim($_POST["type"]);
    $notes = trim($_POST["notes"]);
    $address = "kościół parafialny";
    $id = trim($_POST["id"]);
    if (!isset($id) || !isset($scheduled)) {
      pot();
    }

    $result = $repository -> updateScheduled($description, $scheduled, $value, $type, $notes, $address, $id, $tenant);
    echo($result[0]);
  }

  function pot() {
    echo("gotcha!");
  }
?>
