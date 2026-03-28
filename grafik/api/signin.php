<?php
  header("Content-Type: application/json");

  if (!isset($_SESSION)) {
    session_start();
  }

  require "./repository.php";

  switch (strtolower(trim($_SERVER["REQUEST_METHOD"]))) {
    case "get":
      get();
      break;
    case "post":
      post($repository);
      break;
    default:
      pot();
  }

  function get() {
    if (empty($_SESSION["tenant"])) {
      echo("");
      return;
    }
    
    echo($_SESSION["tenant"]);
  }

  function post($repository) {
    $address = strtolower(trim($_SERVER['REMOTE_ADDR']));
    $tenant = $_POST["tenant"];
    $password = $_POST["password"];
      
    if (!isset($tenant) || !isset($password)) {
      pot();
      return;
    }
    
    $hash = ($repository -> readHash($tenant))[0]["PASSWORD"];
    if (password_verify($password, $hash)) {
      pot();
      return;
    }
    
    $_SESSION["tenant"] = $tenant;
    $newHash = password_hash($password, PASSWORD_DEFAULT);
    $repository -> updateHash($newHash, $address, $tenant);
    echo($tenant);
  }

  function pot() {
    http_response_code(401);
    echo("gotcha!");
  }
?>
