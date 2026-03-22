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

    $name = trim($_GET["name"]);
    if (!isset($name)) {
      pot();
    }
    
    $result = $repository -> readClientByName($name);
    if (0 < count($result)) {
      $e = ($result)[0];
      $toJson = "{\"id\": \"${e["ID"]}\", \"name\": \"${e["NAME"]}\", \"displayName\": \"${e["DISPLAYNAME"]}\"}";
      echo($toJson);
    } else {
      $id = $repository -> createClient($name, $name);
      $toJson = "{\"id\": \"${id}\", \"name\": \"${name}\", \"displayName\": \"${name}\"}";
      echo($toJson);
    }
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
