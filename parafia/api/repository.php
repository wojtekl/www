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
  
  
  public function createScheduled($description, $scheduled, $value, $type, $notes, $address, $tenant) {
    $statement = $this -> sql -> prepare("INSERT INTO `SCHEDULED` VALUES (0, :description, :scheduled, :value, :type, 1, :notes, :address, :tenant, UTC_TIMESTAMP);");
    
    $statement -> bindParam(":description", $description);
    $statement -> bindParam(":scheduled", $scheduled);
    $statement -> bindParam(":value", $value);
    $statement -> bindParam(":type", $type);
    $statement -> bindParam(":notes", $notes);
    $statement -> bindParam(":address", $address);
    $statement -> bindParam(":tenant", $tenant);
    
    return $this -> execute($statement);
  }

  public function readScheduled($today, $tenant, $type){
    $statement = $this -> sql -> prepare("SELECT `ID`, `DESCRIPTION`, `SCHEDULED`, `VALUE`, `BOOKED`, `NOTES`, DAYOFWEEK(`SCHEDULED`) AS `DAYOFWEEK`, DATE_FORMAT(`SCHEDULED`, '%H:%i') AS `TIME`, `TYPE` FROM `SCHEDULED` WHERE" . (null != $today ? " `SCHEDULED` > DATE_ADD(:today, INTERVAL - WEEKDAY(:today) DAY) AND `SCHEDULED` < DATE_ADD(:today, INTERVAL 7 - WEEKDAY(:today) DAY) AND" : " `SCHEDULED` IS NULL AND") . " `TENANT` = :tenant AND `TYPE` = :type ORDER BY `SCHEDULED` ASC;");
    if (null != $today) {
      $statement -> bindParam(":today", $today);
    }
    $statement -> bindParam(":tenant", $tenant);
    $statement -> bindParam(":type", $type);
    
    return $this -> execute($statement);
  }
    
  public function readScheduledById($id, $tenant) {
    $statement = $this -> sql -> prepare("SELECT `ID`, `DESCRIPTION`, `SCHEDULED`, `VALUE`, `BOOKED`, `NOTES`, `TYPE` FROM `SCHEDULED` WHERE `ID` = :id AND `TENANT` = :tenant LIMIT 1;");
    
    $statement -> bindParam(":id", $id);
    $statement -> bindParam(":tenant", $tenant);
    
    return $this -> execute($statement);
  }

  public function updateScheduled($description, $scheduled, $value, $type, $notes, $address, $id, $tenant) {
    $statement = $this -> sql -> prepare("UPDATE `SCHEDULED` SET `DESCRIPTION` = :description, `SCHEDULED` = :scheduled, `VALUE` = :value, `TYPE` = :type, `BOOKED` = 1, `NOTES` = :notes, `ADDRESS` = :address, `CREATED` = UTC_TIMESTAMP WHERE `ID` = :id AND `TENANT` = :tenant;");
    
    $statement -> bindParam(":description", $description);
    $statement -> bindParam(":scheduled", $scheduled);
    $statement -> bindParam(":value", $value);
    $statement -> bindParam(":type", $type);
    $statement -> bindParam(":notes", $notes);
    $statement -> bindParam(":address", $address);
    $statement -> bindParam(":id", $id);
    $statement -> bindParam(":tenant", $tenant);
    
    return $this -> execute($statement);
  }
  
  public function deleteScheduled($id, $tenant) {
    $statement = $this -> sql -> prepare("DELETE FROM `SCHEDULED` WHERE `ID` = :id AND `TENANT` = :tenant;");
    
    $statement -> bindParam(":id", $id);
    $statement -> bindParam(":tenant", $tenant);
    
    return $this -> execute($statement);
  }
  
  
  public function readHash($tenant) {
    $statement = $this -> sql -> prepare("SELECT `PASSWORD` FROM `TENANT` WHERE `NAME` = :tenant");
    
    $statement -> bindParam(":tenant", $tenant);
    
    return $this -> execute($statement);
  }
  
  public function updateHash($newHash, $address, $tenant) {
    $statement = $this -> sql -> prepare("UPDATE `TENANT` SET `PASSWORD` = :hash, `ADDRESS` = :address WHERE `NAME` = :tenant;");
    
    $statement -> bindParam(":hash", $newHash);
    $statement -> bindParam(":address", $address);
    $statement -> bindParam(":tenant", $tenant);
    
    return $this -> execute($statement);
  }
    
  public function readContact($tenant) {
    $statement = $this -> sql -> prepare("SELECT `ID`, `STREET`, `NUMBER`, `CITY`, `POSTALCODE`, `STATE`, `COUNTRY`, `EMAIL`, `PHONE`, `IBAN`, `DESCRIPTION` FROM `CONTACT` WHERE `TENANT` = :tenant");
    
    $statement -> bindParam(":tenant", $tenant);
    
    return $this -> execute($statement);
  }
  
  public function updateContact($description, $street, $number, $city, $postalcode, $email, $phone, $iban, $tenant) {
    $statement = $this -> sql -> prepare("UPDATE `CONTACT` SET `DESCRIPTION` = :description, `STREET` = :street, `NUMBER` = :number, `CITY` = :city, `POSTALCODE` = :postalcode, `EMAIL` = :email, `PHONE` = :phone, `IBAN` = :iban WHERE `TENANT` = :tenant;");
    
    $statement -> bindParam(":description", $description);
    $statement -> bindParam(":street", $street);
    $statement -> bindParam(":number", $number);
    $statement -> bindParam(":city", $city);
    $statement -> bindParam(":postalcode", $postalcode);
    $statement -> bindParam(":email", $email);
    $statement -> bindParam(":phone", $phone);
    $statement -> bindParam(":iban", $iban);
    $statement -> bindParam(":tenant", $tenant);
    
    return $this -> execute($statement);
  }
  
  public function readSettings($tenant) {
    $statement = $this -> sql -> prepare("SELECT `ID`, `SCHEDULE`, `SHOWVISITS`, `SHOWBOOKING` FROM `SETTINGS` WHERE `TENANT` = :tenant");
    
    $statement -> bindParam(":tenant", $tenant);
    
    return $this -> execute($statement);
  }
  
  public function updateSettings($schedule, $showVisits, $showBooking, $tenant) {
    $statement = $this -> sql -> prepare("UPDATE `SETTINGS` SET `SCHEDULE` = :schedule, `SHOWVISITS` = :showVisits, `SHOWBOOKING` = :showBooking WHERE `TENANT` = :tenant;");
    
    $statement -> bindParam(":schedule", $schedule);
    $statement -> bindParam(":showVisits", $showVisits);
    $statement -> bindParam(":showBooking", $showBooking);
    $statement -> bindParam(":tenant", $tenant);
    
    return $this -> execute($statement);
  }
  
  
  public function createVisit($firstname, $surname, $street, $number, $city, $donation, $tenant) {
    $statement = $this -> sql -> prepare("INSERT INTO `VISIT` VALUES (0, :firstname, :surname, :street, :number, :city, :donation, :tenant, 1, UTC_TIMESTAMP);");
    
    $statement -> bindParam(":firstname", $firstname);
    $statement -> bindParam(":surname", $surname);
    $statement -> bindParam(":street", $street);
    $statement -> bindParam(":number", $number);
    $statement -> bindParam(":city", $city);
    $statement -> bindParam(":donation", $donation);
    $statement -> bindParam(":tenant", $tenant);
    
    return $this -> execute($statement);
  }
  
  public function readVisit($tenant) {
    $statement = $this -> sql -> prepare("SELECT `ID`, `FIRSTNAME`, `SURNAME`, `STREET`, `NUMBER`, `CITY`, `VALUE`, `CREATED` FROM `VISIT` WHERE `TENANT` = :tenant AND `CREATED` > DATE_ADD(UTC_TIMESTAMP, INTERVAL -7 DAY) ORDER BY `CREATED` DESC;");
    $statement -> bindParam(":tenant", $tenant);
    
    return $this -> execute($statement);
  }
  
  public function deleteVisit($id, $tenant) {
    $statement = $this -> sql -> prepare("DELETE FROM `VISIT` WHERE `ID` = :id AND `TENANT` = :tenant;");
    
    $statement -> bindParam(":id", $id);
    $statement -> bindParam(":tenant", $tenant);
    
    return $this -> execute($statement);
  }
}

$repository = new Repository($SQL_HOST, $SQL_DATABASE, $SQL_USER, $SQL_PASSWORD);

?>
