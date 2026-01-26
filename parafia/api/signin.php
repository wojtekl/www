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
      get();
      break;
    case "post":
      post($repository);
      break;
    default:
      pot();
  }

  function get() {
    if (isset($_SESSION["tenant"])) {
      echo($_SESSION["tenant"]);
    }
    else {
      //http_response_code(403);
      echo("");
    }
  }

  function post($repository) {
    $address = strtolower(trim($_SERVER['REMOTE_ADDR']));
    $tenant = $_POST["tenant"];
    $password = $_POST["password"];
      
    if (!isset($tenant) || !isset($password)) {
        http_status_code(403);
        echo("");
    }
    
    $hash = ($repository -> readHash($tenant))[0]["PASSWORD"];
    if (password_verify($password, $hash)) {
      $_SESSION["tenant"] = $tenant;
      $newHash = password_hash($password, PASSWORD_DEFAULT);
      $repository -> updateHash($newHash, $address, $tenant);
      echo($_SESSION["tenant"]);
    }
  }

  function pot() {
    echo("gotcha!");
  }
?>
