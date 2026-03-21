<?php
  header("Content-Type: application/json");

  require "./repository.php";

  switch (strtolower(trim($_SERVER["REQUEST_METHOD"]))) {
    case "post":
      post($repository);
      break;
    default:
      pot();
  }

  function post($repository) {
    $today = isset($_POST["today"]) ? trim($_POST["today"]) : null;
    $type = trim($_POST["type"]);
    $tenant = trim($_POST["tenant"]);
    if (!isset($tenant)) {
      pot();
    }

    $result = $repository -> readEvent($today, $tenant, $type);
    $toList = "[";
    foreach ($result as $e) {
      $toList .= "{\"id\": \"${e["ID"]}\", \"description\": \"${e["DESCRIPTION"]}\", \"starting\": \"${e["STARTING"]}\", \"period\": \"${e["PERIOD"]}\", \"notes\": \"${e["NOTES"]}\", \"dayOfWeek\": \"${e["DAYOFWEEK"]}\", \"time\": \"${e["TIME"]}\", \"type\": \"${e["TYPE"]}\"},";
    }
    $toList .= "]";
    echo(str_replace(",]", "]", $toList));
  }

  function pot() {
    echo("gotcha!");
  }
?>
