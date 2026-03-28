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
      echo('');
    }
    
    echo("ok");
  }

  function post($repository) {
    $address = strtolower(trim($_SERVER['REMOTE_ADDR']));
    $tenant = $_POST["tenant"];
    $password = $_POST["password"];
      
    if (!isset($tenant) || !isset($password)) {
      pot();
    }
    
    $hash = ($repository -> readHash($tenant))[0]["PASSWORD"];
    if (password_verify($password, $hash)) {
      pot();
    }
    
    $_SESSION["tenant"] = $tenant;
    $newHash = password_hash($password, PASSWORD_DEFAULT);
    $repository -> updateHash($newHash, $address, $tenant);
    echo("ok");
  }

  function pot() {
    http_response_code(401);
    echo("gotcha!");
  }
?>
