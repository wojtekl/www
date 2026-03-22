<?php
  header("Content-Type: application/json");

  if (!isset($_SESSION)) {
    session_start();
  }

  require "./repository.php";

  switch (strtolower(trim($_SERVER["REQUEST_METHOD"]))) {
    case "get":
      delete($repository);
      break;
    case "post":
      put($repository);
      break;
    default:
      pot();
  }

  function put($repository) {
    $eventId = trim($_POST["eventId"]);
    $clientId = trim($_POST["clientId"]);
    
    $result = $repository -> createAssignment($eventId, $clientId);
    echo($result);
  }
  function delete($repository) {
    $id = trim($_GET["id"]);
    if (!isset($id)) {
      pot();
    }
      
    $repository -> deleteAssignment($id);
  }

  function pot() {
    echo("gotcha!");
  }
?>
