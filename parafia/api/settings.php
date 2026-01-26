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
    if (!isset($tenant)) {
      pot();
    }
    
    $e = ($repository -> readSettings($tenant))[0];
    $toJson = "{\"schedule\": \"${e["SCHEDULE"]}\", \"showVisits\": ${e["SHOWVISITS"]}, \"showBooking\": ${e["SHOWBOOKING"]}}";
    echo($toJson);
  }

  function post($repository) {
    $schedule = trim($_POST["schedule"]);
    $showVisits = trim($_POST["showVisits"]) ? 1 : 0;
    $showBooking = trim($_POST["showBooking"]) ? 1 : 0;
    $tenant = $_SESSION["tenant"];
    if (!isset($tenant) || !isset($schedule) || !isset($showVisits) || !isset($showBooking)) {
      pot();
    }

    $result = $repository -> updateSettings($schedule, $showVisits, $showBooking, $tenant);
    echo(!!$result);
  }

  function pot() {
    echo("gotcha!");
  }
?>
