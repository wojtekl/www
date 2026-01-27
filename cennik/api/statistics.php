<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require "./repository.php";

$country = "pl";
$httpAcceptLanguage = explode(",", $_SERVER["HTTP_ACCEPT_LANGUAGE"]);
if (isset($httpAcceptLanguage[0])) {
  $country = strtolower(substr(trim($httpAcceptLanguage[0]), 3));
}

if(isset($_GET["lang"])) {
  $country = strtolower(trim($_GET["lang"]));
}

switch (strtolower(trim($_SERVER["REQUEST_METHOD"]))) {
  case "post":
    break;
  case "put":
    break;
  case "delete":
    break;
  default:
    get();
}

function get() {
  global $country, $repository;
  $address = trim($_SERVER['REMOTE_ADDR']);
  $client = trim($_SERVER['HTTP_USER_AGENT']);
  if (isset($address) && isset($client)) {
    $repository -> createVisit($address, $client, $country);
  }
}

?>
