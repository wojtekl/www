<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Content-Type: application/json");

  require "./repository.php";

  if (!isset($_SESSION)) {
    session_start();
  }

  switch (strtolower(trim($_SERVER["REQUEST_METHOD"]))) {
    case "get":
      delete();
      break;
    case "post":
      post($repository);
      break;
    default:
      pot();
  }

  function post($repository) {
    $tenant = $_POST["tenant"];
    $code = $_POST["code"];
    $password = $_POST["password"];
    if (!isset($tenant) || !isset($code) || !isset($password)) {
      pot();
    }
      
    $hash = ($repository -> readHash($tenant))[0]["PASSWORD"];
    if ($hash == $code) {
      $newHash = password_hash($password, PASSWORD_DEFAULT);
      //($repository -> updateHash($newHash, $address, $tenant))[0]["PASSWORD"];
      echo($newHash);
      session_destroy();
    }
  }
  
  function delete() {
    session_destroy();
  }

  function pot() {
    echo("gotcha!");
  }
?>
