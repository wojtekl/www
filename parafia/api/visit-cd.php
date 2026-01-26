<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Content-Type: application/json");

  require "./repository.php";

  if (!isset($_SESSION)) {
    session_start();
  }
  $tenant = $_SESSION["tenant"];
  if (!isset($tenant)) {
    pot();
  }

  $address = strtolower(trim($_SERVER['REMOTE_ADDR']));

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
    $firstname = trim($_POST["firstname"]);
    $surname = isset($_POST["surname"]);
    $street = isset($_POST["street"]);
    $number = trim($_POST["number"]);
    $city = trim($_POST["city"]);
    $donation = isset($_POST["donation"]) ? trim($_POST["donation"]) : 0;
    
    $result = $repository -> createVisit($firstname, $surname, $street, $number, $city, $donation, $tenant);
    echo($result);
  }

  function delete($repository, $tenant) {
    $id = trim($_GET["id"]);
    if (!isset($id)) {
      pot();
    }
      
    $repository -> deleteVisit($id, $tenant);
  }

  function pot() {
    echo("gotcha!");
  }
?>
