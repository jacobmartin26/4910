USE Team21_db;

-- ADDING DRIVERS TO THE DB
DELIMITER $$
DROP PROCEDURE IF EXISTS AddDriver;

CREATE PROCEDURE AddDriver(
    IN p_fname VARCHAR(20),
    IN p_lname VARCHAR(25),
    IN p_email VARCHAR(100),
    IN p_dob DATE,
    IN p_address VARCHAR(255),
    IN p_licenseNum VARCHAR(25),
    IN p_company_id INT,
    IN p_car_licensePlate VARCHAR(10),
    IN p_car_make VARCHAR(20),
    IN p_car_model VARCHAR(20)
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_driver_id INT;
    DECLARE v_car_id INT;
    
    -- Inserting user info into users table
    INSERT INTO Users(fname, lname, userType, email, dob, accountStatus)
    VALUES(p_fname, p_lname, 2, p_email, p_dob, 1);
    
    -- Retrieving the last inserted user_id
    SET v_user_id = LAST_INSERT_ID();
    
    -- Inserting driver info into driver table
    INSERT INTO Driver(address, licenseNum, company_id, user_id, points)
    VALUES(p_address, p_licenseNum, p_company_id, v_user_id, 0);
    
    -- Retrieving the last inserted driver_id
    SET v_driver_id = LAST_INSERT_ID();
    
    -- Inserting car info into car table
    INSERT INTO Car(licensePlate, make, model, driver_id)
    VALUES(p_car_licensePlate, p_car_make, p_car_model, v_driver_id);
    
    -- Retrieving the last inserted car_id
    SET v_car_id = LAST_INSERT_ID();
    
    -- Updating driver's car_id in driver table
    UPDATE Driver SET car_id = v_car_id WHERE driver_id = v_driver_id;
    
    SELECT CONCAT('Driver ', p_fname, ' ', p_lname, ' added successfully.') AS Message;
END $$
DELIMITER ;

CALL AddDriver('Jane', 'Smith', 'jane@example.com', '1995-05-15', '456 Oak St', 'XYZ123', 1, 'ABC123', 'Toyota', 'Camry');

-- ADDING SPONSORS TO THE DB
DELIMITER $$
DROP PROCEDURE IF EXISTS AddSponsor;

CREATE PROCEDURE AddSponsor(
    IN p_company_id INT,
    IN p_fname VARCHAR(20),
    IN p_lname VARCHAR(25),
    IN p_email VARCHAR(100),
    IN p_dob DATE
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_sponsor_id INT;
    
    -- Inserting user info into users table
    INSERT INTO Users(fname, lname, userType, email, dob, accountStatus)
    VALUES(p_fname, p_lname, 3, p_email, p_dob, 1);
    
    -- Retrieving the last inserted user_id
    SET v_user_id = LAST_INSERT_ID();
    
    -- Inserting sponsor info into sponsor table
    INSERT INTO Sponsor(company_id, user_id)
    VALUES(p_company_id, v_user_id);
    
    -- Retrieving the last inserted sponsor_id
    SET v_sponsor_id = LAST_INSERT_ID();
    
    SELECT CONCAT('Sponsor ', p_fname, ' ', p_lname, ' added successfully.') AS Message;
END $$
DELIMITER ;

CALL AddSponsor('1','Alice', 'Johnson', 'alice@example.com', '1985-12-10');



-- ADDING ADMIN TO THE DB
DELIMITER $$
DROP PROCEDURE IF EXISTS AddAdmin;

CREATE PROCEDURE AddAdmin(
    IN p_fname VARCHAR(20),
    IN p_lname VARCHAR(25),
    IN p_email VARCHAR(100),
    IN p_dob DATE,
    IN p_address VARCHAR(255)
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_company_id INT;
    DECLARE v_admin_id INT;

    -- Inserting user info into users table
    INSERT INTO Users(fname, lname, userType, email, dob, accountStatus)
    VALUES(p_fname, p_lname, 1, p_email, p_dob, 1);
    
    -- Retrieving the last inserted user_id
    SET v_user_id = LAST_INSERT_ID();
    
    -- Inserting admin info into admins table
    INSERT INTO Admins(address, user_id)
    VALUES(p_address, v_user_id);
    
    -- Retrieving the last inserted admin_id
    SET v_admin_id = LAST_INSERT_ID();
    
    SELECT CONCAT('Admin ', p_fname, ' ', p_lname, ' added successfully.') AS Message;
END $$
DELIMITER ;

CALL AddAdmin('John', 'Doe', 'john@example.com', '1990-01-01', '123 Main St');


