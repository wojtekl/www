<?php

require "./_global.php";

header("Content-Type: application/json");

try {
  $conn = new PDO("mysql:host=$SQL_HOST;dbname=$SQL_DATABASE", $SQL_USER, $SQL_PASSWORD);
  $conn -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $stmt= $conn -> prepare(file_get_contents("sql_ddl"));
  $stmt -> execute();
  $conn = null;
}
catch(PDOException $e) {
  echo $e -> getMessage();
}

?>
