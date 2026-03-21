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
    $starting = isset($_POST["starting"]) ? trim($_POST["starting"]) : null;
    $period = isset($_POST["period"]) ? trim($_POST["period"]) : 0;
    $type = trim($_POST["type"]);
    $notes = trim($_POST["notes"]);
    $address= "";
    
    $result = $repository -> createEvent($description, $starting, $period, $type, $notes, $address, $tenant);
    echo($result);
  }

  function delete($repository, $tenant) {
    $id = trim($_GET["id"]);
    if (!isset($id)) {
      pot();
    }
      
    $repository -> deleteEvent($id, $tenant);
  }

  function pot() {
    echo("gotcha!");
  }
?>
