USE Team21_db;

# Trigger to say in audit log when a new user was added to system
DELIMITER $$
DROP TRIGGER IF EXISTS NewUserTrigger;
CREATE TRIGGER NewUserTrigger
AFTER INSERT ON Users
FOR EACH ROW
BEGIN
    DECLARE user_id_added INT;
    SET user_id_added = NEW.user_id;
    INSERT INTO NewUser (user_id, event_description)
    VALUES (user_id_added, CONCAT('New user with user_id ', user_id_added, ' was added'));
END$$
DELIMITER ;

# Trigger to say when a login attempt was unsuccessful
DROP TRIGGER IF EXISTS UnsuccessfulLogin;
DELIMITER $$
CREATE TRIGGER UnsuccessfulLogin
AFTER INSERT
ON AuditLogin
FOR EACH ROW
BEGIN
    IF NEW.login_success = 'unsuccessful' THEN
        INSERT INTO Audit (event_description)
        VALUES ('Unsuccessful login attempt'); # Placeohlder, should get user ID and timestamp
    END IF;
END $$
DELIMITER ;