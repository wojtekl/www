<?php
  header("Content-Type: application/json");

  if (!isset($_SESSION)) {
    session_start();
  }
  $person = $_SESSION["person"];
  if (!isset($person)) {
    pot();
  }

  require "./repository.php";

  switch (strtolower(trim($_SERVER["REQUEST_METHOD"]))) {
    case "get":
      get($repository, $person);
      break;
    case "post":
      post($repository, $person);
      break;
    default:
      pot();
  }

  function get($repository, $person) {
    $id = trim($_GET["id"]);
    if (!isset($id)) {
      pot();
    }
    
    $e = ($repository -> readEvnetById($id, $person))[0];
    $toJson = "{\"description\": \"${e["DESCRIPTION"]}\", \"scheduled\": \"${e["SCHEDULED"]}\", \"value\": \"${e["VALUE"]}\", \"notes\": \"${e["NOTES"]}\", \"type\": \"${e["TYPE"]}\"}";
    echo($toJson);
  }

  function post($repository, $person) {
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

    $result = $repository -> updateEvent($description, $scheduled, $value, $type, $notes, $address, $id, $tenant);
    echo($result[0]);
  }

  function pot() {
    echo("gotcha!");
  }
?>
