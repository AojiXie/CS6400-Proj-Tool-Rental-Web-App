
CREATE TABLE Phone (
  PhoneID INT(10) AUTO_INCREMENT PRIMARY KEY,
  phone_type varchar (50) NOT NULL,
  area_code varchar(3) NOT NULL,
  phone_number varchar(7) NOT NULL,
  extension varchar(4) NOT NULL
  );

CREATE TABLE Customer (
  username varchar(50) NOT NULL,
  CustomerID INT(10) AUTO_INCREMENT PRIMARY KEY,
  email varchar (50) NOT NULL,
  password varchar (50) NOT NULL,
  first_name varchar (50) NOT NULL,
  middle_name varchar (50) NULL,
  last_name varchar (50) NOT NULL,
  state varchar(50) NOT NULL,
  city varchar(50) NOT NULL,
  street varchar(50) NOT NULL,
  zip_code varchar(5) NOT NULL,
  zip_extension varchar(4) NULL,
  cvc_3_digit_number varchar(3) NOT NULL,
  card_number varchar(50) NOT NULL,
  name_on_card varchar(50) NOT NULL,
  month varchar(2) NOT NULL,
  year varchar(2) NOT NULL,
  PhoneID INT(10) NOT NULL,  
  FOREIGN KEY (PhoneID)
	REFERENCES Phone (PhoneID),
  UNIQUE (username)
  );
  
 
 CREATE TABLE Secondary (
  CustomerID INT(10) NOT NULL,
  PhoneID INT(10) NOT NULL,
   FOREIGN KEY (CustomerID)
	REFERENCES Customer (CustomerID),
  FOREIGN KEY (PhoneID)
	REFERENCES Phone (PhoneID),
  UNIQUE (CustomerID, PhoneID)
  );
 
 
 CREATE TABLE Clerk (
  username varchar(50) NOT NULL,
  ClerkID INT(10) AUTO_INCREMENT PRIMARY KEY,
  email varchar (50) NOT NULL,
  password varchar (50) NOT NULL,
  first_name varchar (50) NOT NULL,
  middle_name varchar (50) NULL,
  last_name varchar (50) NOT NULL,
  employer_number varchar(50) NOT NULL,
  hire_date date NOT NULL,
  UNIQUE (username));
 
 CREATE TABLE Tool (
  ToolID INT(10) AUTO_INCREMENT PRIMARY KEY,
  original_price FLOAT NOT NULL, 
  power_source varchar(50) NOT NULL,
  manufacturer varchar(50) NULL,
  sub_option varchar(50) NOT NULL,
  sub_type varchar(50) NOT NULL,
  material varchar(50) NULL,
  width FLOAT NOT NULL,
  length FLOAT NOT NULL,
  weight FLOAT NOT NULL,
  type varchar(50) NOT NULL);
  
 CREATE TABLE Reservation (
  reservationID INT(10) AUTO_INCREMENT PRIMARY KEY,
  start_date date NOT NULL, 
  end_date date NOT NULL,
  CustomerID INT(10) NOT NULL,
  DropClerkID INT(10) NULL,
  PickClerkID INT(10) NULL,  
  FOREIGN KEY (CustomerID)
	REFERENCES Customer (CustomerID),
  FOREIGN KEY (DropClerkID)
	REFERENCES Clerk (ClerkID),
  FOREIGN KEY (PickClerkID)
	REFERENCES Clerk (ClerkID));
    
CREATE TABLE AddRes (
  ToolID INT(10) NOT NULL,
  reservationID INT(10) NOT NULL,
  UNIQUE (ToolID, reservationID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID),
  FOREIGN KEY (reservationID)
	REFERENCES Reservation (reservationID));

CREATE TABLE ServiceOrder (
  ServiceOrderID INT(10) AUTO_INCREMENT PRIMARY KEY,
  ClerkID INT(10) NOT NULL,
  ToolID INT(10) NOT NULL,  
  service_start_date date NOT NULL, 
  service_end_date date NOT NULL, 
  repair_cost FLOAT NOT NULL, 
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID),
  FOREIGN KEY (ClerkID)
	REFERENCES Clerk (ClerkID));

CREATE TABLE ToolForSale (
  SaleID INT(10) AUTO_INCREMENT PRIMARY KEY,
  ClerkID INT(10) NOT NULL,
  CustomerID INT(10) NULL,
  ToolID INT(10) NOT NULL,  
  for_sale_date date NOT NULL, 
  sold_date date NULL, 
  UNIQUE (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID),
  FOREIGN KEY (ClerkID)
	REFERENCES Clerk (ClerkID),
  FOREIGN KEY (CustomerID)
	REFERENCES Customer (CustomerID));

CREATE TABLE PowerTool (
  ToolID INT(10) NOT NULL,
  amp_rating FLOAT NOT NULL, 
  min_rpm_rating FLOAT NOT NULL,
  volt_rating FLOAT NOT NULL,
  max_rpm_rating FLOAT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID));

CREATE TABLE Accessory (
  ToolID INT(10) NOT NULL,
  AccessoryName varchar(50) NOT NULL,
  accessory_quantity INT NOT NULL,
  PRIMARY KEY (ToolID, AccessoryName),
  FOREIGN KEY (ToolID)
	REFERENCES PowerTool (ToolID));
    
 CREATE TABLE Cordless (
  CordlessID INT(10) AUTO_INCREMENT PRIMARY KEY,
  battery_type varchar(50) NOT NULL);
 
CREATE TABLE Sander (
  ToolID INT(10) NOT NULL,
  dust_bag BOOLEAN NOT NULL,
  CordlessID INT(10) NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES PowerTool (ToolID),
  FOREIGN KEY (CordlessID)
	REFERENCES Cordless (CordlessID));
    
CREATE TABLE Saw (
  ToolID INT(10) NOT NULL,
  blade_size FLOAT NOT NULL,
  CordlessID INT(10) NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES PowerTool (ToolID),
  FOREIGN KEY (CordlessID)
	REFERENCES Cordless (CordlessID));

CREATE TABLE Drill (
  ToolID INT(10) NOT NULL,
  min_torque_rating FLOAT NOT NULL,
  max_torque_rating FLOAT NULL,
  adjustable_clutch BOOLEAN NOT NULL,
  CordlessID INT(10) NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES PowerTool (ToolID),
  FOREIGN KEY (CordlessID)
	REFERENCES Cordless (CordlessID));

CREATE TABLE AirCompressor (
  ToolID INT(10) NOT NULL,
  tank_size FLOAT NOT NULL,
  pressure_rating FLOAT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES PowerTool (ToolID)
);

CREATE TABLE Mixer (
  ToolID INT(10) NOT NULL,
  motor_rating FLOAT NOT NULL,
  drum_size FLOAT NOT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES PowerTool (ToolID)
);

CREATE TABLE Generator (
  ToolID INT(10) NOT NULL,
  power_rating FLOAT NOT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES PowerTool (ToolID)
);

CREATE TABLE Step (
  ToolID INT(10) NOT NULL,
  step_count INT NULL,
  weight_capacity FLOAT NULL,
  pail_shelf BOOLEAN NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID)
);

CREATE TABLE Straight (
  ToolID INT(10) NOT NULL,
  rubber_feet BOOLEAN NULL,
  step_count INT NULL,
  weight_capacity FLOAT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID)
);



CREATE TABLE Screwdriver (
  ToolID INT(10) NOT NULL,
  screw_size INT NOT NULL,
  weight_capacity FLOAT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID)
);

CREATE TABLE Socket (
  ToolID INT(10) NOT NULL,
  deep_socket BOOLEAN NULL,
  drive_size FLOAT NOT NULL,
  sae_size FLOAT NOT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID)
);

CREATE TABLE Plier (
  ToolID INT(10) NOT NULL,
  adjustable BOOLEAN NOT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID)
);

CREATE TABLE Gun (
  ToolID INT(10) NOT NULL,
  capacity INT NOT NULL,
  gauge_rating INT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID)
);

CREATE TABLE Hammer (
  ToolID INT(10) NOT NULL,
  anti_vibration BOOLEAN NOT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID)
);

CREATE TABLE Rachet (
  ToolID INT(10) NOT NULL,
  driver_size INT NOT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID)
);


CREATE TABLE Pruner (
  ToolID INT(10) NOT NULL,
  handle_material varchar(50) NOT NULL,
  blade_length FLOAT NOT NULL,
  blade_material varchar(50) NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID)
);

CREATE TABLE Digger (
  ToolID INT(10) NOT NULL,
  handle_material varchar(50) NOT NULL,
  blade_length FLOAT NOT NULL,
  blade_width FLOAT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID)
);

CREATE TABLE Striking (
  ToolID INT(10) NOT NULL,
  handle_material varchar(50) NOT NULL,
  head_weight FLOAT NOT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID)
);

CREATE TABLE Rakes (
  ToolID INT(10) NOT NULL,
  handle_material varchar(50) NOT NULL,
  tine_count INT NOT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID)
);

CREATE TABLE Wheelbarrow (
  ToolID INT(10) NOT NULL,
  handle_material varchar(50) NOT NULL,
  wheel_count INT NOT NULL,
  bin_material varchar(50) NOT NULL,
  bin_volume FLOAT NULL,
  PRIMARY KEY (ToolID),
  FOREIGN KEY (ToolID)
	REFERENCES Tool (ToolID)
);

ALTER TABLE Customer
Add CONSTRAINT Customer 
    CHECK (zip_code LIKE REPLICATE('[0-9]', 5)),
Add CONSTRAINT Customer 
    CHECK (zip_extension LIKE REPLICATE('[0-9]', 4)),
Add CONSTRAINT Customer 
    CHECK (cvc_3_digit_number LIKE REPLICATE('[0-9]', 3)),    
Add CONSTRAINT Customer 
    CHECK (card_number LIKE REPLICATE('[0-9]', 16)),
Add CONSTRAINT Customer 
    CHECK (month LIKE REPLICATE('[0-9]', 2)),
Add CONSTRAINT Customer 
    CHECK (year LIKE REPLICATE('[0-9]', 2));
    
ALTER TABLE Phone
Add CONSTRAINT Phone 
    CHECK (area_code LIKE REPLICATE('[0-9]', 3)),
Add CONSTRAINT Phone 
    CHECK (phone_number LIKE REPLICATE('[0-9]', 7)),
Add CONSTRAINT Phone 
    CHECK (extension LIKE REPLICATE('[0-9]', 4));

ALTER TABLE Reservation
Add CONSTRAINT Reservation
	CHECK (start_date < end_date);
ALTER TABLE ServiceOrder
Add CONSTRAINT Reservation
	CHECK (service_start_date < service_end_date);
    
    