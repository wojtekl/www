<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: Content-Type");
  header("Content-Type: application/json");

  if (!isset($_SESSION)) {
    session_start();
  }

  $address = strtolower(trim($_SERVER['REMOTE_ADDR']));

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
    if (!isset($tenant)) {
      pot();
    }
    
    $e = ($repository -> readContact($tenant))[0];
    $toJson = "{\"description\": \"${e["DESCRIPTION"]}\", \"street\": \"${e["STREET"]}\", \"number\": \"${e["NUMBER"]}\", \"city\": \"${e["CITY"]}\", \"postalcode\": \"${e["POSTALCODE"]}\", \"state\": \"${e["STATE"]}\", \"country\": \"${e["COUNTRY"]}\", \"email\":\"${e["EMAIL"]}\", \"phone\": \"${e["PHONE"]}\", \"iban\": \"${e["IBAN"]}\"}";
    echo($toJson);
  }

  function post($repository) {
    $description = trim($_POST["description"]);
    $street = trim($_POST["street"]);
    $number = trim($_POST["number"]);
    $city = trim($_POST["city"]);
    $postalcode = trim($_POST["postalcode"]);
    $email = trim($_POST["email"]);
    $phone = trim($_POST["phone"]);
    $iban = trim($_POST["iban"]);
    $tenant = $_SESSION["tenant"];
    if (!isset($tenant) || !isset($description) || !isset($street) || !isset($number) || !isset($city) || !isset($postalcode) || !isset($email) || !isset($phone) || !isset($iban)) {
      pot();
    }

    $result = $repository -> updateContact($description, $street, $number, $city, $postalcode, $email, $phone, $iban, $tenant);
    echo($result[0]);
  }

  function pot() {
    echo("gotcha!");
  }
?>
