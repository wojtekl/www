<?php
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
    case "get":
      get($repository, $country);
      break;
    case "post":
      post($repository, $country);
      break;
    default:
      pot();
  }

  function get($repository, $country) {
    $result = $repository -> getItem(trim($_GET["name"]));
    $list = "[";
    foreach ($result as $row) {
      $list .= "{\"store\": \"${row["SKLEP"]}\", \"price\": ${row["CENA"]}, \"posted\": \"${row["DODANO"]}\", \"coupon\": \"${row["COUPON"]}\", \"bulk\": \"${row["BULK"]}\", \"id\": ${row["ID"]}},";
    }
    $list .= "]";
    echo str_replace(",]", "]", $list);
  }

  function post($repository, $country) {
    if(isset($_POST["lang"])) {
      $country = strtolower(trim($_POST["lang"]));
    }

    $item = trim($_POST["name"]);
    $store = strtolower(trim($_POST["store"]));
    $price = trim($_POST["price"]);
    $coupon = trim($_POST["coupon"]);
    $bulk = trim($_POST["bulk"]);
    $day = 0;
    if(isset($_POST["day"])) {
      $day = trim($_POST["day"]);
    }
    $identyfikator = strtolower(trim($_POST["identyfikator"]));
    if (isset($identyfikator) && isset($item) && isset($store) && isset($price) && isset($coupon) && isset($bulk)) {
      $repository -> insertPrice($item, $store, $price, $country, $identyfikator, $coupon ? 1 : 0, $bulk ? 1 : 0, $day);
    }
  }

  function pot() {
    echo("gotcha!");
  }

?>
