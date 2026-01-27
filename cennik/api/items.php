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

switch (strtolower(trim($_SERVER["REQUEST_METHOD"]))) {
  case "post":
    post();
    break;
  case "put":
    put();
    break;
  case "delete":
    delete();
    break;
  default:
    get();
}

function get() {
  global $country, $repository;
  
  if(isset($_GET["lang"])) {
    $country = strtolower(trim($_GET["lang"]));
  }
  
  $selected = trim($_GET["selected"]);
  $result = [];
  if ("" != $selected) {
    $result = $repository -> getSelected($selected);
  }
  else {
    $result = $repository -> getItems($country);
  }
  $list = "[";
  foreach ($result as $row) {
    $list .= "{\"item\": \"${row["PRODUKT"]}\", \"store\": \"${row["SKLEP"]}\", \"price\": ${row["CENA"]}, \"posted\": \"${row["DODANO"]}\", \"coupon\": \"${row["COUPON"]}\", \"bulk\": \"${row["BULK"]}\", \"id\": ${row["ID"]}, \"lowest\": ${row["LOWEST"]}},";
  }
  $list .= "]";
  echo str_replace(",]", "]", $list);
}

function post() {
  global $country, $repository;
}

function put() {
  global $country, $repository;
}

function delete() {
  global $country, $repository;
}

?>
