USE Team21_db;

# GRANT SELECT ON Company TO driver, administrator;

# search for company names similar to what was entered
# ex: if john is entered then johnson would also show up
SELECT * FROM Company WHERE company_name LIKE '%b%' -- placeholder value
group by company_name
order by company_name asc;

# filter all drivers by name in ascending order
SELECT *
FROM Users
INNER JOIN Driver ON Users.user_id = Driver.user_id
WHERE Users.userType = 1
group by lname, fname
order by lname asc;

# view a specific driver's points
SELECT Users.fname, Users.lname, Driver.points
FROM Users
INNER JOIN Driver ON Users.user_id = Driver.user_id
WHERE Users.userType = 1 -- type 1 = driver
AND Users.fname = 'John' -- placeholder name,
AND Users.lname = 'Doe'; -- put user's name here