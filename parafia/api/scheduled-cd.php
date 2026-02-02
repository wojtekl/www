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
      delete($repository, $tenant);
      break;
    case "post":
      put($repository, $tenant);
      break;
    default:
      pot();
  }

  function put($repository, $tenant) {
    $description = trim($_POST["description"]);
    $scheduled = isset($_POST["scheduled"]) ? trim($_POST["scheduled"]) : null;
    $value = isset($_POST["value"]) ? trim($_POST["value"]) : 0;
    $type = trim($_POST["type"]);
    $notes = trim($_POST["notes"]);
    $address= "kościół parafialny";
    
    $result = $repository -> createScheduled($description, $scheduled, $value, $type, $notes, $address, $tenant);
    echo($result);
  }

  function delete($repository, $tenant) {
    $id = trim($_GET["id"]);
    if (!isset($id)) {
      pot();
    }
      
    $repository -> deleteScheduled($id, $tenant);
  }

  function pot() {
    echo("gotcha!");
  }
?>
