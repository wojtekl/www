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
      $toJson .= "{\"id\": ${a["ID"]},\"clientId\": ${a["CLIENT_ID"]},\"displayName\": \"${a["DISPLAYNAME"]}\",\"accepted\": ${a["ACCEPTED"]},\"count\": ${a["COUNT"]}},";
    }
    $toJson .= "]";
    $toJson = (str_replace(",]", "]", $toJson));
    
    echo($toJson);
  }

  function post($repository) {
    $assignment = $_POST["assignment"];
    
    foreach($assignment as $id => $accepted) {
      $repository -> updateAssignment($id, $accepted);
    }
    echo('ok');
  }

  function pot() {
    echo("gotcha!");
  }
?>
