<?php

require "./_global.php";

class Repository {
  private $sql;
  
  public function __construct($SQL_HOST, $SQL_DATABASE, $SQL_USER, $SQL_PASSWORD) {
    $this -> sql = new PDO("mysql:host=$SQL_HOST;dbname=$SQL_DATABASE", $SQL_USER, $SQL_PASSWORD);
    
    $this -> sql -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  }
  
  public function __destruct() {
    $this -> sql = null;
  }
  
  private function execute($dml) {
    try {
      $query = $this -> sql -> prepare($dml);
      $query -> execute();
      return $query -> fetchAll();
    }
    catch(PDOException $exception) {
      return $exception -> getMessage();
    }
  }
  
  public function insertPrice($item, $store, $price, $country, $id, $coupon, $bulk, $day) {
    return $this -> execute("INSERT INTO `CENA` VALUES (0, '$item', '$store', '$price', '$country', '$id', TIMESTAMPADD(DAY, $day, UTC_TIMESTAMP), '$coupon', '$bulk');");
  }
  
  public function getItem($item) {
    return $this -> execute("SELECT `ID`, `SKLEP`, `CENA`, `DODANO`, `COUPON`, `BULK` FROM `CENA` WHERE `PRODUKT` = '$item' ORDER BY `DODANO` DESC, `CENA`, `SKLEP` LIMIT 10;");
  }

  public function getSelected($selected) {
    return $this -> execute("SELECT `ID`, `PRODUKT`, `SKLEP`, `CENA`, `DODANO`, `COUPON`, `BULK`, (SELECT MIN(`CENA`) FROM `CENA` WHERE `PRODUKT` = `c`.`PRODUKT`) AS `LOWEST` FROM `CENA` `c` WHERE `ID` IN ($selected) ORDER BY `SKLEP`, `PRODUKT`");
  }
  
  public function getItems($country) {
    return $this -> execute("SELECT COALESCE(`q1`.`ID`, `q2`.`ID`) AS `ID`, `q2`.`PRODUKT` AS `PRODUKT`, COALESCE(`q1`.`SKLEP`, `q2`.`SKLEP`) AS `SKLEP`, COALESCE(CONVERT(`q1`.`CENA`, CHAR), CONVERT(`q2`.`CENA`, CHAR)) AS `CENA`, COALESCE(`q1`.`DODANO`, `q2`.`DODANO`) AS `DODANO`, COALESCE(`q1`.`COUPON`, `q2`.`COUPON`) AS `COUPON`, COALESCE(`q1`.`BULK`, `q2`.`BULK`) AS `BULK`, IFNULL(CONVERT(`q3`.`CENA`, CHAR), 0) AS `LOWEST` FROM (SELECT `ID`, `PRODUKT`, `SKLEP`, `CENA`, `DODANO`, `COUPON`, `BULK` FROM `CENA` `c1` WHERE `ID` = (SELECT `ID` FROM `CENA` WHERE `PRODUKT` = `c1`.`PRODUKT` AND `KRAJ` LIKE '%$country%' AND `DODANO` >= UTC_TIMESTAMP - INTERVAL 7 DAY ORDER BY `CENA`, `DODANO` DESC LIMIT 1)) `q1` RIGHT JOIN (SELECT `ID`, `PRODUKT`, `SKLEP`, `CENA`, `DODANO`, `COUPON`, `BULK` FROM `CENA` `c2` WHERE `ID` = (SELECT `ID` FROM `CENA` WHERE `PRODUKT` = `c2`.`PRODUKT` AND `KRAJ` LIKE '%$country%' ORDER BY `DODANO` DESC LIMIT 1)) `q2` ON `q2`.`PRODUKT` = `q1`.`PRODUKT` LEFT JOIN (SELECT `ID`, `CENA` FROM `CENA` `c2` WHERE `ID` = (SELECT `ID` FROM `CENA` WHERE `PRODUKT` = `c2`.`PRODUKT` AND `KRAJ` LIKE '%$country%' ORDER BY `CENA`, `DODANO` DESC LIMIT 1)) `q3` ON `q3`.`ID` = `q1`.`ID` ORDER BY `DODANO` DESC;");
  }

  public function createVisit($address, $client, $country) {
    return $this -> execute("INSERT INTO `VISIT` VALUES (0, '$address', '$client', '$country', UTC_TIMESTAMP);");
  }
}

$repository = new Repository($SQL_HOST, $SQL_DATABASE, $SQL_USER, $SQL_PASSWORD);

?>
