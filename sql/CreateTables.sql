Create database if not exists Team21_db;
USE Team21_db;

CREATE TABLE if not exists Users(
	user_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    fname varchar(20) not null,
    lname varchar(25) not null,
    userType int not null, -- 1 = driver, 2 = sponsor, 3 = admin
    email varchar(100) not null,
    dob date not null,
    accountStatus int not null,
    failed_login_attempts int not null default 0
);

CREATE TABLE IF NOT EXISTS Company(
company_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
company_name VARCHAR(50),
company_email VARCHAR(255)
);

create table if not exists Driver(
driver_id int primary key auto_increment not null,
company_id int,
user_id int,
points double(10,2),
foreign key (company_id) references Company(company_id),
foreign key (user_id) references Users(user_id)
);

create table if not exists Car(
car_id int primary key auto_increment not null,
licensePlate varchar(10) not null,
make varchar(20) not null,
model varchar(20) not null,
driver_id int,
foreign key (driver_id) references Driver(driver_id)
);

create table if not exists Admins(
admin_id int primary key auto_increment not null,
address varchar(255) not null,
user_id int,
foreign key (user_id) references Users(user_id)
);

CREATE TABLE IF NOT EXISTS Sponsor(
sponsor_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
company_id INT,
user_id INT,
foreign key (company_id) references Company(company_id),
foreign key (user_id) references Users(user_id)
);

CREATE TABLE if not exists Reason(
	reason_id INT PRIMARY KEY auto_increment NOT NULL,
    reason varchar(256) NOT NULL,
    company_id INT,
    foreign key (company_id) references Company(company_id)
);
USE Team21_db;
DROP TABLE PointRule;
CREATE TABLE if not exists PointRule(
	point_id INT PRIMARY KEY auto_increment NOT NULL,
    driver_id INT,
    sponsor_id INT,
    reason_id INT,
    pointTime TIMESTAMP,
    actions VARCHAR(7),
    numPoints double,
    foreign key (driver_id) references Users(user_id),
    foreign key (sponsor_id) references Users(user_id),
    foreign key (reason_id) references Reason(reason_id)
);

CREATE TABLE IF NOT EXISTS About(
	about_id INT PRIMARY KEY auto_increment NOT NULL,
    team_num INT,
    sprint INT,
    release_date DATE,
    prod_name VARCHAR(20),
    prod_descript VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS DriverApp(
	driverapp_id INT PRIMARY KEY auto_increment NOT NULL,
    company_id INT,
    driver_id INT,
    stat INT, -- 0 = incomplete, 1 = completed, 2 = pending, 3 = accepted, 4 = denied, 5 = revoked
    submitted TIMESTAMP,
    foreign key (company_id) references Company(company_id),
    foreign key (driver_id) references Users(user_id)
);

CREATE TABLE IF NOT EXISTS PassChange(
	passchange_id INT PRIMARY KEY auto_increment NOT NULL,
    user_id INT,
    type_change INT,
    stamp TIMESTAMP,
    foreign key (user_id) references Users(user_id)
);

CREATE TABLE IF NOT EXISTS AppStat(
	appstat_id INT PRIMARY KEY auto_increment NOT NULL,
    sponsor_id INT,
    driverapp_id INT,
    stamp TIMESTAMP,
    reason VARCHAR(128),
	foreign key (driverapp_id) references DriverApp(driverapp_id),
    foreign key (sponsor_id) references Users(user_id)
);

CREATE TABLE IF NOT EXISTS Logon(
    logon_id INT PRIMARY KEY auto_increment NOT NULL,
    user_id INT,
    stamp TIMESTAMP,
    foreign key (user_id) references Users(user_id)
);

CREATE TABLE IF NOT EXISTS PointChange(
    pointchange_id INT PRIMARY KEY auto_increment NOT NULL,
    driver_id INT,
    sponsor_id INT,
    point_id INT,
    reason_id INT,
    stamp TIMESTAMP,
    foreign key (driver_id) references Users(user_id),
	foreign key (sponsor_id) references Users(user_id),
    foreign key (point_id) references PointRule(point_id),
    foreign key (reason_id) references Reason(reason_id)
);

CREATE TABLE IF NOT EXISTS NewUser (
    audit_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_id INT,
    event_description VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE IF NOT EXISTS User_Org(
	userOrg_id INT PRIMARY KEY auto_increment NOT NULL,
    user_id INT,
    company_id INT,
    foreign key (user_id) references Users(user_id),
    foreign key (company_id) references Company(company_id)
);

CREATE TABLE IF NOT EXISTS BadLogin (
	login_id INT PRIMARY KEY auto_increment NOT NULL,
    event_description VARCHAR(256),
    stamp TIMESTAMP
);

CREATE TABLE IF NOT EXISTS PointConversion(
	conversion_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    company_id INT,
    points double,
    money double,
    foreign key (company_id) references Company(company_id)
);

CREATE TABLE IF NOT EXISTS Cart (
	cart_id INT PRIMARY KEY auto_increment NOT NULL,
    user_id INT NOT NULL,
    prod_id INT NOT NULL,
    prod_title varchar(256) NOT NULL,
    prod_image varchar(1024) NOT NULL,
    prod_cost INT NOT NULL,
    company_id INT NOT NULL,
    foreign key (user_id) references Users(user_id),
    foreign key (company_id) references Driver(company_id)
);

CREATE TABLE IF NOT EXISTS Orders(
	order_id INT PRIMARY KEY auto_increment NOT NULL,
    driver_id INT,
    total_cost INT,
    stamp TIMESTAMP,
    order_status INT,
	foreign key (driver_id) references Driver(driver_id)
);

CREATE TABLE IF NOT EXISTS Item (
	item_id INT PRIMARY KEY auto_increment NOT NULL,
    prod_id INT,
    prod_title varchar(256),
    prod_cost INT,
    order_id INT,
    foreign key (order_id) references Orders(order_id)
);

CREATE TABLE IF NOT EXISTS Mediatypes (
    media_id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT,
    media_type VARCHAR(50),
    FOREIGN KEY (company_id) REFERENCES User_Org(company_id)
);

