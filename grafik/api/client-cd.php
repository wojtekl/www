<?php
  header("Content-Type: application/json");

  if (!isset($_SESSION)) {
    session_start();
  }

  require "./repository.php";

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
  }
  
  function delete() {
    session_destroy();
  }

  function pot() {
    echo("gotcha!");
  }
?>
