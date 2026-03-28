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

    $tenant = trim($_GET["tenant"]);
    if (empty($tenant)) {
      pot();
    }
    
    $e = ($repository -> readSettings($tenant))[0];
    $toJson = "{\"message\": \"${e["MESSAGE"]}\", \"disableBooking\": ${e["DISABLEBOOKING"]}}";
    echo($toJson);
  }

  function post($repository) {
    $message = trim($_POST["message"]);
    $disableBooking = trim($_POST["disableBooking"]) ? 1 : 0;
    $tenant = $_SESSION["tenant"];
    if (empty($tenant) || !isset($message) || !isset($disableBooking)) {
      pot();
    }
    
    $groupPassword = trim($_POST["groupPassword"]);
    if (!empty($groupPassword)) {
      $newHash = password_hash($groupPassword, PASSWORD_DEFAULT);
      $repository -> updateGroupPassword($newHash, '', $tenant);
    }

    $result = $repository -> updateSettings($message, $disableBooking, $tenant);
    echo(!!$result);
  }

  function pot() {
    echo("gotcha!");
  }
?>
