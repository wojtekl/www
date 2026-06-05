<?php

require "./_global.php";

class Repository {
  private $sql;
  
  public function __construct($SQL_HOST, $SQL_DATABASE, $SQL_USER, $SQL_PASSWORD) {
    try {
      $this -> sql = new PDO("mysql:host=$SQL_HOST;dbname=$SQL_DATABASE;charset=utf8", $SQL_USER, $SQL_PASSWORD);
      
      $this -> sql -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch(PDOException $exception) {
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
  
  
  public function createEvent($description, $scheduled, $value, $type, $notes, $address, $tenant) {
    $statement = $this -> sql -> prepare("INSERT INTO `EVENT` VALUES (0, :name, :description, :type, :scheduled, :notes, 0, :city, :postalcode, :state, :country, :website, UTC_TIMESTAMP)");
    
    $statement -> bindParam(":name", $name);
    $statement -> bindParam(":description", $description);
    $statement -> bindParam(":type", $type);
    $statement -> bindParam(":scheduled", $scheduled);
    $statement -> bindParam(":notes", $notes);
    $statement -> bindParam(":approved", $approved);
    $statement -> bindParam(":city", $city);
    $statement -> bindParam(":postalcode", $postalcode);
    $statement -> bindParam(":state", $state);
    $statement -> bindParam(":country", $country);
    $statement -> bindParam(":website", $website);
    
    return $this -> execute($statement);
  }

  public function readEvent($today){
    $statement = $this -> sql -> prepare("SELECT `ID`, `NAME`, `DESCRIPTION`, `TYPE`, `SCHEDULED`, `NOTES`, `APPROVED`, `CITY`, `POSTALCODE`, `STATE`, `COUNTRY`, `WEBSITE`, DAYOFWEEK(`SCHEDULED`) AS `DAYOFWEEK`, DATE_FORMAT(`SCHEDULED`, '%H:%i') AS `TIME` FROM `EVENT` WHERE" . (null != $today ? " `SCHEDULED` > DATE_ADD(:today, INTERVAL - WEEKDAY(:today) DAY) AND `SCHEDULED` < DATE_ADD(:today, INTERVAL 7 - WEEKDAY(:today) DAY)" : " `SCHEDULED` IS NULL") . " ORDER BY `SCHEDULED` ASC");
    if (null != $today) {
      $statement -> bindParam(":today", $today);
    }
    
    return $this -> execute($statement);
  }
    
  public function readEventById($id, $tenant) {
    $statement = $this -> sql -> prepare("SELECT `ID`, `NAME`, `DESCRIPTION`, `TYPE`, `SCHEDULED`, `NOTES`, `APPROVED`, `CITY`, `POSTALCODE`, `STATE`, `COUNTRY`, `WEBSITE`, DAYOFWEEK(`SCHEDULED`) AS `DAYOFWEEK`, DATE_FORMAT(`SCHEDULED`, '%H:%i') AS `TIME` FROM `EVENT` WHERE `ID` = :id LIMIT 1");
    
    $statement -> bindParam(":id", $id);
    
    return $this -> execute($statement);
  }

  public function updateEvent($description, $scheduled, $value, $type, $notes, $address, $id, $tenant) {
    $statement = $this -> sql -> prepare("UPDATE `EVENT` SET `NAME` = :name, `DESCRIPTION` = :description, `TYPE` = :type, `SCHEDULED` = :scheduled, `NOTES` = :notes, `APPROVED` = :approved, `CITY` = :city, `POSTALCODE` = :postalcode, `STATE` = :state, `COUNTRY` = :country, `WEBSITE` = :website, `CREATED` = UTC_TIMESTAMP WHERE `ID` = :id");

    $statement -> bindParam(":name", $name);
    $statement -> bindParam(":description", $description);
    $statement -> bindParam(":type", $type);
    $statement -> bindParam(":scheduled", $scheduled);
    $statement -> bindParam(":notes", $notes);
    $statement -> bindParam(":approved", $approved);
    $statement -> bindParam(":city", $city);
    $statement -> bindParam(":postalcode", $postalcode);
    $statement -> bindParam(":state", $state);
    $statement -> bindParam(":country", $country);
    $statement -> bindParam(":website", $website);
    $statement -> bindParam(":id", $id);
    
    return $this -> execute($statement);
  }
  
  public function deleteEvent($id) {
    $statement = $this -> sql -> prepare("DELETE FROM `EVENT` WHERE `ID` = :id");
    
    $statement -> bindParam(":id", $id);
    
    return $this -> execute($statement);
  }
  
  
  public function readHash($person) {
    $statement = $this -> sql -> prepare("SELECT `PASSWORD` FROM `PERSON` WHERE `NAME` = :person");
    
    $statement -> bindParam(":person", $person);
    
    return $this -> execute($statement);
  }
  
  public function updateHash($newHash, $address, $person) {
    $statement = $this -> sql -> prepare("UPDATE `PERSON` SET `PASSWORD` = :hash, `ADDRESS` = :address WHERE `NAME` = :person");
    
    $statement -> bindParam(":hash", $newHash);
    $statement -> bindParam(":address", $address);
    $statement -> bindParam(":person", $person);
    
    return $this -> execute($statement);
  }
    
  public function readPerson($person) {
    $statement = $this -> sql -> prepare("SELECT `ID`, `NAME`, `DESCRIPTION`, `SEX`, `NOTES`, `APPROVED` FROM `PERSON` WHERE `NAME` = :person");
    
    $statement -> bindParam(":person", $person);
    
    return $this -> execute($statement);
  }
  
  public function updatePerson($name, $description, $sex, $notes, $approved) {
    $statement = $this -> sql -> prepare("UPDATE `PERSON` SET `NAME` = :name, `DESCRIPTION` = :description, `SEX` = :sex, `NOTES` = :notes, `APPROVED` = :approved WHERE `NAME` = :name");
    
    $statement -> bindParam(":name", $name);
    $statement -> bindParam(":description", $description);
    $statement -> bindParam(":sex", $sex);
    $statement -> bindParam(":notes", $notes);
    $statement -> bindParam(":approved", $approved);
    
    return $this -> execute($statement);
  }

  public function createLog($address, $client, $country) {
    $statement = $this -> sql -> prepare("INSERT INTO `LOGBOOK` VALUES (0, :address, :client, :country, UTC_TIMESTAMP)");
    
    $statement -> bindParam(":address", $address);
    $statement -> bindParam(":client", $client);
    $statement -> bindParam(":country", $country);
    
    return $this -> execute($statement);
  }
  
  public function readLog() {
    $statement = $this -> sql -> prepare("SELECT COUNT(*) AS `COUNT` FROM `LOGBOOK` WHERE CREATED > DATE_SUB(UTC_TIMESTAMP, INTERVAL 1 DAY)");
    
    return $this -> execute($statement);
  }
}

$repository = new Repository($SQL_HOST, $SQL_DATABASE, $SQL_USER, $SQL_PASSWORD);

?>
