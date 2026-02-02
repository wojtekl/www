<?php

require "./_global.php";

class Repository {
  private $sql;
  
  public function __construct($SQL_HOST, $SQL_DATABASE, $SQL_USER, $SQL_PASSWORD) {
    try {
      $this -> sql = new PDO("mysql:host=$SQL_HOST;dbname=$SQL_DATABASE;", $SQL_USER, $SQL_PASSWORD);
      
      $this -> sql -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch(PDOException $exception) {
      return -1;
    }
  }
  
  public function __destruct() {
    $this -> sql = null;
  }
  
  private function execute($query) {
    try {
      $query -> execute();
      return $query -> fetchAll();
    }
    catch(PDOException $exception) {
      return $exception -> getMessage();
    }
  }
  
  public function insertPrice($item, $store, $price, $country, $id, $coupon, $bulk, $day) {
    $statement = $this -> sql -> prepare("INSERT INTO `CENA` VALUES (0, :item, :store, :price, :country, :id, TIMESTAMPADD(DAY, :day, UTC_TIMESTAMP), :coupon, :bulk)");
    $statement -> bindParam(":item", $item);
    $statement -> bindParam(":store", $store);
    $statement -> bindParam(":price", $price);
    $statement -> bindParam(":country", $country);
    $statement -> bindParam(":id", $id);
    $statement -> bindParam(":coupon", $coupon);
    $statement -> bindParam(":bulk", $bulk);
    $statement -> bindParam(":day", $day);
    return $this -> execute($statement);
  }
  
  public function getItem($item) {
    $statement = $this -> sql -> prepare("SELECT `ID`, `SKLEP`, `CENA`, `DODANO`, `COUPON`, `BULK` FROM `CENA` WHERE `PRODUKT` = :item ORDER BY `DODANO` DESC, `CENA`, `SKLEP` LIMIT 10");
    $statement -> bindParam(":item", $item);
    return $this -> execute($statement);
  }

  public function getSelected($selected) {
    $inValues = explode(',', $selected);
    $inParams = ":par1";
    for($i = 1; $i < count($inValues); ++$i) {
        $inParams .= ", :par" . ($i + 1);
    }
    $statement = $this -> sql -> prepare("SELECT `ID`, `PRODUKT`, `SKLEP`, `CENA`, `DODANO`, `COUPON`, `BULK`, (SELECT MIN(`CENA`) FROM `CENA` WHERE `PRODUKT` = `c`.`PRODUKT`) AS `LOWEST` FROM `CENA` `c` WHERE `ID` IN ($inParams) ORDER BY `SKLEP`, `PRODUKT`");
    for($i = 0; $i < count($inValues); ++$i) {
      $statement -> bindParam(":par" . ($i + 1), $inValues[$i]);
    }
    return $this -> execute($statement);
  }
  
  public function getItems($country) {
    $statement = $this -> sql -> prepare("SELECT COALESCE(`q1`.`ID`, `q2`.`ID`) AS `ID`, `q2`.`PRODUKT` AS `PRODUKT`, COALESCE(`q1`.`SKLEP`, `q2`.`SKLEP`) AS `SKLEP`, COALESCE(CONVERT(`q1`.`CENA`, CHAR), CONVERT(`q2`.`CENA`, CHAR)) AS `CENA`, COALESCE(`q1`.`DODANO`, `q2`.`DODANO`) AS `DODANO`, COALESCE(`q1`.`COUPON`, `q2`.`COUPON`) AS `COUPON`, COALESCE(`q1`.`BULK`, `q2`.`BULK`) AS `BULK`, IFNULL(CONVERT(`q3`.`CENA`, CHAR), 0) AS `LOWEST` FROM (SELECT `ID`, `PRODUKT`, `SKLEP`, `CENA`, `DODANO`, `COUPON`, `BULK` FROM `CENA` `c1` WHERE `ID` = (SELECT `ID` FROM `CENA` WHERE `PRODUKT` = `c1`.`PRODUKT` AND `KRAJ` LIKE :country AND `DODANO` >= UTC_TIMESTAMP - INTERVAL 7 DAY ORDER BY `CENA`, `DODANO` DESC LIMIT 1)) `q1` RIGHT JOIN (SELECT `ID`, `PRODUKT`, `SKLEP`, `CENA`, `DODANO`, `COUPON`, `BULK` FROM `CENA` `c2` WHERE `ID` = (SELECT `ID` FROM `CENA` WHERE `PRODUKT` = `c2`.`PRODUKT` AND `KRAJ` LIKE :country ORDER BY `DODANO` DESC LIMIT 1)) `q2` ON `q2`.`PRODUKT` = `q1`.`PRODUKT` LEFT JOIN (SELECT `ID`, `CENA` FROM `CENA` `c2` WHERE `ID` = (SELECT `ID` FROM `CENA` WHERE `PRODUKT` = `c2`.`PRODUKT` AND `KRAJ` LIKE :country ORDER BY `CENA`, `DODANO` DESC LIMIT 1)) `q3` ON `q3`.`ID` = `q1`.`ID` ORDER BY `DODANO` DESC");
    $likeCountry = '%' . $country . '%';
    $statement -> bindParam(":country", $likeCountry);
    return $this -> execute($statement);
  }

  public function createLog($address, $client, $country) {
    $statement = $this -> sql -> prepare("INSERT INTO `VISIT` VALUES (0, :address, :client, :country, UTC_TIMESTAMP)");
    $statement -> bindParam(":address", $address);
    $statement -> bindParam(":client", $client);
    $statement -> bindParam(":country", $country);
    return $this -> execute($statement);
  }
  
  public function readLog($country) {
    $statement = $this -> sql -> prepare("SELECT COUNT(*) AS `COUNT` FROM `VISIT`");
    $statement -> bindParam(":country", $country);
    return $this -> execute($statement);
  }
}

$repository = new Repository($SQL_HOST, $SQL_DATABASE, $SQL_USER, $SQL_PASSWORD);

?>
