from flask import Blueprint, request, jsonify, Flask
# pip install mysql-connector-python
import mysql.connector
# import os
from flask_cors import CORS, cross_origin
from datetime import datetime

# application = Flask(__name__, static_folder='./matx-react-master/build')
# cors = CORS(application)
# application.config['CORS_HEADERS'] = 'Content-Type'

# Set up connection
db_config = {
    'user': ,
    'password': ,
    'host': ,
    'port': 3306,
    'database': ,
}

# Connect to MySQL
# connection = mysql.connector.connect(**db_config)
# cursor = connection.cursor(dictionary=True)
# cursor2 = connection.cursor(dictionary=True)
# testing inserting into db
# sql = "INSERT INTO `Company` (`company_name`) VALUES (%s)"
# cursor.execute(sql, ['test'])
# connection.commit()

# frequent query used to get last user id entered into db
last_user_query = "SELECT user_id FROM Users ORDER BY user_id DESC LIMIT 1"

api = Blueprint('api', __name__)


@api.route('/add_user', methods=['POST'])
def add_user():
    connection = mysql.connector.connect(**db_config)
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        fname = data.get('fname')
        print(fname)
        lname = data.get('lname')
        print(lname)
        userType = data.get('userType')
        print(userType)
        password = data.get('password')
        dob = data.get('dob')
        print(dob)
        email = data.get('email')
        print(email)
        address = data.get('address')
        print(address)

        # license = data.get('licenseNum')
        try:
            # Connect to the MySQL database
            cursor = connection.cursor()
            print("connected")

            # Check if the email already exists in the database
            cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
            print("select succeeded")
            existing_user = cursor.fetchone()
            print("fetched successfully")

            if existing_user:
                # If email already exists, return an error response
                print("bad email")
                return jsonify({'error': 'Email already in use'}), 400

            # Insert the new user into the Users table
            print("connected")
            cursor.execute("INSERT INTO Users (fname, lname, userType, email, dob, accountStatus) VALUES (%s,%s,%s,%s,%s,%s)",
                           (fname, lname, userType, email, dob, 1))
            print("test")
            connection.commit()
            cursor.execute(last_user_query)
            last_user_id = cursor.fetchone()
            # if userType == '1':
            # cursor.execute("INSERT INTO Driver (address, licenseNum, company_id, user_id, car_id, points) VALUES (%s,%s,%s,%s,%s,%s)", (address,license,1,last_user_id[0],1,0.0))#(address, license,0, last_user_id,0,0))
            # connection.commit()
            # if userType == '2':
            # cursor.execute("INSERT INTO Sponsor (company_id, user_id) VALUES (%s,%s)", (1,last_user_id[0]))
            # connection.commit()
            # if userType == '3':
            # cursor.execute("INSERT INTO Admins (address, user_id) VALUES (%s,%s)", (address,last_user_id[0]))
            # connection.commit()
            connection.close()
            return jsonify({'message': 'User added successfully'}), 200
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500


@api.route('/log_login', methods=['POST'])
def log_login():
    connection = mysql.connector.connect(**db_config)
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        email = data.get('email')
        password = data.get('password')
        try:
            # Connect to the MySQL database
            cursor = connection.cursor()
            print("connected")
            # Retrieve user_id from users table based on email
            cursor.execute(
                "SELECT user_id FROM Users WHERE email = %s", (email,))
            print("SELECT executed successfully")
            user = cursor.fetchone()
            print("fetched successfully")
            print(user)
            if user:
                user_id = user[0]
                print("user assigned")

                # Insert into Logon table
                cursor.execute(
                    "INSERT INTO Logon (user_id, stamp) VALUES (%s, current_timestamp())", (user_id,))
                print("logged successfully")
                connection.commit()
                connection.close()
                return jsonify({'message': 'Login successfully recorded'}), 200
            else:
                connection.close()
                return jsonify({'error': 'User not found'}), 404
        except mysql.connector.Error as e:
            connection.close()
            return jsonify({'error': str(e)}), 500


@api.route('/log_bad_login', methods=['POST'])
def log_bad_login():
    connection = mysql.connector.connect(**db_config)
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        email = data.get('email')
        password = data.get('password')
        try:
            # Connect to the MySQL database
            cursor = connection.cursor()
            print("connected")
            # Insert into BadLogin table
            event_description = f"User failed to login with email: {email}"
            print(email)
            cursor.execute(
                "INSERT INTO BadLogin (event_description, stamp) VALUES (%s, current_timestamp())", (event_description,))
            print("Inserted")
            connection.commit()
            print("Committed")
            connection.close()
            return jsonify({'message': 'Bad login attempt recorded'}), 200
        except mysql.connector.Error as e:
            connection.close()
            return jsonify({'error': str(e)}), 500


# route for getting all companies
@api.route('/Company', methods=['GET'])
@cross_origin(origin='*')
def get_companies():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "SELECT * FROM Company;"
    cursor.execute(query)
    companies = cursor.fetchall()
    print(companies)
    company_list = []
    for company in companies:
        company_data = {
            'company_id': company[0],
            'company_name': company[1],
        }
        company_list.append(company_data)
    print(company_list)
    cursor.close()
    connection.close()
    res = jsonify({'companies': company_list})
    res.headers.add('Access-Control-Allow-Origin', '*')
    return res


@api.route('/About', methods=['GET'])
@cross_origin()
def get_about():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "SELECT * FROM About ORDER BY about_id DESC LIMIT 1"
    cursor.execute(query)
    abouts = cursor.fetchone()
    if abouts:
        cursor.close()
        connection.close()
        return jsonify(abouts)
    else:
        return jsonify({'error': "Latest about not found"})
# route to get all drivers


@api.route('/Drivers', methods=['GET'])
def get_drivers():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "select u.fname, u.lname, d.points, d.user_id, c.company_name, d.driver_id from Driver d INNER JOIN Users u INNER JOIN Company c ON d.user_id = u.user_id and c.company_id = d.company_id"
    cursor.execute(query)
    drivers = cursor.fetchall()
    driver_list = []
    for driver in drivers:
        driver_data = {
            'fname': driver[0],
            'lname': driver[1],
            'points': driver[2],
            'user_id': driver[3],
            'company_name': driver[4],
            'driver_id': driver[5],
        }
        driver_list.append(driver_data)
    cursor.close()
    connection.close()
    return jsonify({"drivers": driver_list})
# route to get all admins


@api.route('/Admins', methods=['GET'])
def get_admins():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "SELECT * FROM Admins"
    cursor.execute(query)
    admins = cursor.fetchall()
    admin_list = []
    for admin in admins:
        admin_data = {
            'admin_id': admin['admin_id'],
            'address': admin['address'],
            'user_id': admin['user_id'],
        }
        admin_list.append(admin_data)
    cursor.close()
    connection.close()
    return jsonify({"admins": admin_list})
# route to get all sponsors


@api.route('/Sponsors', methods=['GET'])
def get_sponsors():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "SELECT * FROM Sponsor"
    cursor.execute(query)
    sponsors = cursor.fetchall()
    sponsor_list = []
    for sponsor in sponsors:
        sponsor_data = {
            'sponsor_id': sponsor['sponsor_id'],
            'company_id': sponsor['company_id'],
            'user_id': sponsor['user_id'],
        }
        sponsor_list.append(sponsor_data)
    cursor.close()
    connection.close()
    return jsonify({"sponsors": sponsor_list})
# route to get all users


@api.route('/Users', methods=['GET'])
def get_users():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "SELECT * FROM Users"
    cursor.execute(query)
    users = cursor.fetchall()
    user_list = []
    for user in users:
        user_data = {
            'user_id': user[0],
            'fname': user[1],
            'lname': user[2],
            'userType': user[3],
            'email': user[4],
            'dob': user[5],
            'accountStatus': user[6],
        }
        user_list.append(user_data)
    cursor.close()
    connection.close()
    return jsonify({"users": user_list})
# route to get specific user by id


@api.route('/User/<user_id>', methods=['GET'])
def get_user(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "SELECT * FROM Users WHERE user_id = " + user_id + ";"
    cursor.execute(query)
    user_data = cursor.fetchone()
    if user_data:
        cursor.close()
        connection.close()
        return jsonify(user_data)
    else:
        cursor.close()
        connection.close()
        return jsonify({'error': "User not found"})
# route to get specific driver by id


@api.route('/Driver/<driver_id>', methods=['GET'])
def get_driver(driver_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "select u.fname, u.lname, d.points, d.user_id from Driver d INNER JOIN Users u ON d.user_id = u.user_id WHERE u.user_id = " + driver_id + ";"
    query = "select u.fname, u.lname, d.points, d.user_id from Driver d INNER JOIN Users u ON d.user_id = u.user_id WHERE u.user_id = " + driver_id + ";"
    cursor.execute(query)
    driver_data = cursor.fetchone()
    if driver_data:
        cursor.close()
        connection.close()
        return jsonify(driver_data)
    else:
        cursor.close()
        connection.close()
        return jsonify({'error': "Driver not found"})
# route to get specific sponsor by id


@api.route('/Sponsor/<sponsor_id>', methods=['GET'])
def get_sponsor(sponsor_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "SELECT * FROM Sponsor WHERE sponsor_id = " + sponsor_id + ";"
    cursor.execute(query)
    sponsor_data = cursor.fetchone()
    if sponsor_data:
        cursor.close()
        connection.close()
        return jsonify(sponsor_data)
    else:
        cursor.close()
        connection.close()
        return jsonify({'error': "Sponsor not found"})
# route to get specific admin by id


@api.route('/Admin/<admin_id>', methods=['GET'])
def get_admin(admin_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "SELECT * FROM Admins WHERE admin_id = " + admin_id + ";"
    cursor.execute(query)
    admin_data = cursor.fetchone()
    if admin_data:
        cursor.close()
        connection.close()
        return jsonify(admin_data)
    else:
        cursor.close()
        connection.close()
        return jsonify({'error': "Admin not found"})
# route to get specific company by id


@api.route('/Company/<company_id>', methods=['GET'])
@cross_origin(origin='*')
def get_company(company_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "SELECT * FROM Company WHERE company_id = " + company_id + ";"
    cursor.execute(query)
    company_data = cursor.fetchone()
    if company_data:
        cursor.close()
        connection.close()
        return jsonify(company_data)
    else:
        cursor.close()
        connection.close()
        return jsonify({'error': "Company not found"})

# route to get last username entered into db


@api.route('/username', methods=['GET'])
def get_last_user():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "SELECT email FROM Users ORDER BY user_id DESC LIMIT 1"
    cursor.execute()
    username = cursor.fetchone()
    if username:
        cursor.close()
        connection.close()
        return jsonify(username)
    else:
        cursor.close()
        connection.close()
        return jsonify({'error': "Username not found"})


# route to change password
@api.route('/proxy/resetPassword', methods=['POST'])
@cross_origin(origins={"*"})
def resetPassword():
    connection = mysql.connector.connect(**db_config)
    try:
        # Get data from the request
        data = request.json
        email = data.get('email')
        newPassword = data.get('newPassword')

        if email is None or newPassword is None:
            return jsonify({'error': 'Email and newPassword are required fields'}), 400

        cursor = connection.cursor()
        print("connected")
        # Update the password in the Users table
        update_query = "UPDATE Users SET password = %s WHERE email = %s"
        cursor.execute(
            update_query, (newPassword, email))
        cursor.close()
        connection.close()
        return jsonify({'message': 'Password changed successfully'}), 200

    except Exception as e:
        cursor.close()
        connection.close()
        return jsonify({'error': str(e)}), 500


@api.route('/Users/email/update', methods=['POST'])
@cross_origin()
def update_user_email():
    connection = mysql.connector.connect(**db_config)
    if request.method == 'POST':
        # Get request data
        data = request.get_json()

    # Extract current and new email from request data
        current_email = data.get('currentEmail')
        new_email = data.get('newEmail')

        if not current_email or not new_email:
            return jsonify({'error': 'Current email and new email are required'}), 400

    # Your logic to update the user email in the database
        try:
            cursor = connection.cursor()
        # Update user's email based on current email
            query = "UPDATE Users SET email = %s WHERE email = %s"
            cursor.execute(query, (new_email, current_email))
            connection.commit()

            cursor.close()
            connection.close()

            return jsonify({'message': 'User email updated successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500


@api.route('/add_app', methods=['POST'])
def add_app():
    connection = mysql.connector.connect(**db_config)
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        company_id = data.get('company_id')
        driver_id = data.get('driver_id')
        stat = data.get('stat')
        current_time = datetime.now()
        submit = current_time.strftime("%Y-%m-%d %H:%M:%S")
        # print(company_id)
        # print(type(driver_id))
        # print(driver_id)
        # print(stat)
        try:
            # Connect to the MySQL database
            cursor = connection.cursor()
            print("connected")

            cursor.execute("INSERT INTO DriverApp (company_id, driver_id, stat,submitted) VALUES (%s,%s,%s,%s)",
                           (company_id, driver_id, stat, submit))
            connection.commit()
            cursor.execute(last_user_query)
            last_user_id = cursor.fetchone()
            cursor.close()
            connection.close()
            return jsonify({'message': 'App added successfully'}), 200
        except mysql.connector.Error as e:
            cursor.close()
            connection.close()
            return jsonify({'error': str(e)}), 500


@api.route('/App/<user_id>', methods=['GET'])
@cross_origin(origin='*')
def get_user_apps(user_id):
    # cursor = connection.cursor()
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    print(cursor)
    query = "SELECT d.driverapp_id, c.company_name, d.stat, d.submitted FROM DriverApp d INNER JOIN Company c ON d.company_id = c.company_id WHERE driver_id = " + user_id + ";"
    cursor.execute(query)
    apps = cursor.fetchall()
    print(apps)
    app_list = []
    for app in apps:
        app_data = {
            'driverapp_id': app[0],
            'company_name': app[1],
            'stat': app[2],
            'submit': app[3]
        }
        app_list.append(app_data)
        print(app_list)
    cursor.close()
    connection.close()
    res = jsonify({"applications": app_list})
    res.headers.add('Access-Control-Allow-Origin', '*')
    return res


@api.route('/Users/email/<email>', methods=['GET'])
@cross_origin(origin='*')
def get_user_from_email(email):
    connection = mysql.connector.connect(**db_config)
    # Connect to the MySQL database
    cursor = connection.cursor()
    print("connected")
    print(email)
    # Retrieve user_id from users table based on email
    query = "SELECT * FROM Users WHERE email = '" + email + "';"
    cursor.execute(query)
    print("SELECT executed successfully")
    user = cursor.fetchone()
    print("fetched successfully")
    print(user)
    if user:
        cursor.close()
        connection.close()
        return jsonify({'user_id': user}), 200
    else:
        cursor.close()
        connection.close()
        print("User not found")
        return jsonify({'error': 'User not found'}), 404
# get all applications for a specific company


@api.route('/Sponsor/app/<user_id>', methods=['GET'])
def get_sponsor_apps(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    print("connected")
    query = "select company_id from User_Org where user_id = " + user_id + " LIMIT 1;"
    cursor.execute(query)
    company = cursor.fetchone()
    cursor2 = connection.cursor()
    print(str(company[0]))
    query2 = "SELECT u.fname, u.lname, d.stat, d.driverapp_id, d.submitted FROM DriverApp d INNER JOIN Users u on d.driver_id = u.user_id WHERE company_id =" + \
        str(company[0]) + ";"
    cursor2.execute(query2)
    apps = cursor2.fetchall()
    app_list = []
    for app in apps:
        app_data = {
            'fname': app[0],
            'lname': app[1],
            'stat': app[2],
            'driverapp_id': app[3],
            'submit': app[4]
        }
        app_list.append(app_data)
        print(app_list)
    # cursor.close()
    if app_list:
        cursor.close()
        cursor2.close()
        connection.close()
        return jsonify({"applications": app_list})
    else:
        cursor.close()
        cursor2.close()
        connection.close()
        return jsonify({'error': 'Applications not found'}), 404

# get all applications


@api.route('/admin/app', methods=['GET'])
def get_admin_apps():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "select u.fname, u.lname, c.company_name, d.stat, d.driverapp_id, d.submitted from DriverApp d INNER JOIN Users u INNER JOIN Company c WHERE d.company_id = c.company_id and d.driver_id = u.user_id;"
    cursor.execute(query)
    apps = cursor.fetchall()
    app_list = []
    for app in apps:
        app_data = {
            'fname': app[0],
            'lname': app[1],
            'company_name': app[2],
            'stat': app[3],
            'driverapp_id': app[4],
            'submit': app[5]
        }
        app_list.append(app_data)
        # print(app_list)
    cursor.close()
    connection.close()
    return jsonify({"applications": app_list})
# route to update driver applications


@api.route('/update_app', methods=['POST'])
def update_app():
    connection = mysql.connector.connect(**db_config)
    if request.method == 'POST':
        # Get data
        data = request.json
        # app_id = data.get('driverapp_id')
        # company_id = data.get('company_id')
        driver_id = data.get('driver_id')
        stat = data.get('stat')

        try:
            # Connect to the MySQL database
            cursor = connection.cursor()
            query = "select * FROM DriverApp ORDER BY driverapp_id DESC LIMIT 1;"
            cursor.execute(query)
            app_data = cursor.fetchone()
            company_id = app_data[1]
            app_id = app_data[0]

            # Update the application in the database
            cursor.execute("UPDATE DriverApp SET company_id=%s, driver_id=%s, stat=%s WHERE driverapp_id=%s",
                           (company_id, driver_id, stat, app_id))
            connection.commit()

            cursor.close()
            connection.close()
            return jsonify({'message': 'App updated successfully'}), 200
        except mysql.connector.Error as e:
            cursor.close()
            connection.close()
            return jsonify({'error': str(e)}), 500

# route to update driver applications and app stat


@api.route('/update_appstat', methods=['POST'])
def update_appstat():
    connection = mysql.connector.connect(**db_config)
    if request.method == 'POST':
        # Get data
        data = request.json
        # app_id = data.get('driverapp_id')
        # company_id = data.get('company_id')
        # driver_id = data.get('driver_id')
        stat = data.get('stat')
        driverapp_id = data.get('driverapp_id')
        sponsor = data.get('sponsor')
        reason = data.get('reason')
        print(reason)
        print(stat)
        print(sponsor)
        try:
            # Connect to the MySQL database
            print("in try sect")
            cursor = connection.cursor()
            # Update the application in the database
            cursor.execute("UPDATE DriverApp SET stat=%s WHERE driverapp_id=%s",
                           (stat, driverapp_id))
            connection.commit()
            print("passed 1")
            cursor.close()
            cursor2 = connection.cursor()
            current_time = datetime.now()
            formatted_time = current_time.strftime("%Y-%m-%d %H:%M:%S")
            print("passed first query")
            # Add to AppStat
            cursor2.execute("INSERT INTO AppStat (sponsor_id, driverapp_id, stamp, reason) VALUES (%s, %s,%s,%s)",
                            (sponsor, driverapp_id, formatted_time, reason))
            connection.commit()

            cursor2.close()
            connection.close()
            return jsonify({'message': 'App updated successfully'}), 200
        except mysql.connector.Error as e:
            #cursor2.close()
            connection.close()
            return jsonify({'error': str(e)}), 500

# get all applications for a specific company


@api.route('/Sponsor/app/pending/<user_id>', methods=['GET'])
def get_sponsor_pendings(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "select company_id from User_Org where user_id = " + user_id + " LIMIT 1;"
    cursor.execute(query)
    company = cursor.fetchone()
    print(company[0])
    query2 = "SELECT u.fname, u.lname, d.stat, d.driverapp_id, d.submitted, u.user_id FROM DriverApp d INNER JOIN Users u on d.driver_id = u.user_id WHERE company_id =" + \
        str(company[0]) + " AND stat = 2;"
    cursor.execute(query2)
    apps = cursor.fetchall()
    app_list = []
    for app in apps:
        app_data = {
            'fname': app[0],
            'lname': app[1],
            'stat': app[2],
            'driverapp_id': app[3],
            'submit': app[4],
            'user_id': app[5]
        }
        app_list.append(app_data)
        print(app_list)
    cursor.close()
    if app_list:
        cursor.close()
        connection.close()
        return jsonify({"applications": app_list})
    else:
        cursor.close()
        connection.close()
        return jsonify({'error': 'Applications not found'}), 404


@api.route('/add_product', methods=['POST'])
@cross_origin(origins={"*"})
def add_product():
    print("REQUEST BELOW!! REQUEST BELOW!! REQUEST BELOW!! REQUEST BELOW!! REQUEST BELOW!! REQUEST BELOW!! REQUEST BELOW!!")
    print(request)
    print(request.json['user_id'])
    print(request.json['prod_id'])
    print(request.json['prod_title'])
    print(request.json['prod_image'])
    print(request.json['prod_cost'])
    print(request.json['company_id'])
    # Get product details from request
    user_id = request.json['user_id']
    prod_id = request.json['prod_id']
    prod_title = request.json['prod_title']
    prod_image = request.json['prod_image']
    prod_cost = request.json['prod_cost']
    company_id = request.json['company_id']

    # Insert product into Cart table
    try:
        # Connect to the MySQL database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Check if the user & item already exists in a row of Cart table
        cursor.execute(
            "SELECT * FROM Cart WHERE user_id = %s AND prod_id = %s AND company_id = %s", (user_id, prod_id, company_id,))
        print("select succeeded")
        duplicate = cursor.fetchone()
        print("fetched successfully")

        if duplicate:
            # If email already exists, return an error response
            print("item already in cart")
            return jsonify({'error': 'Item already present in the cart'}), 400

        print("Attempting insert")
        cursor.execute("INSERT INTO Cart (user_id, prod_id, prod_title, prod_image, prod_cost, company_id) VALUES (%s, %s, %s, %s, %s, %s)",
                       (user_id, prod_id, prod_title, prod_image, prod_cost, company_id))
        print("Inserted")
        connection.commit()
        print("Committed")
        cursor.close()
        connection.close()
        # Return success response with product details
        return jsonify({
            # 'message': 'Product added to cart successfully',
            'product': {
                'user_id': user_id,
                'prod_id': prod_id,
                'prod_title': prod_title,
                'prod_image': prod_image,
                'prod_cost': prod_cost,
                'company_id': company_id
            }
        }), 200
    except Exception as e:
        connection.rollback()
        cursor.close()
        connection.close()
        return jsonify({'error': str(e)}), 500


@api.route('/edit_about', methods=['POST'])
def edit_about():
    connection = mysql.connector.connect(**db_config)
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        # aboutID = data.get('aboutID')
        prodDesc = data.get('prodDesc')
        prodName = data.get('prodName')
        sprint = data.get('sprint')
        teamNum = data.get('teamNum')
        current_time = datetime.now()
        submit = current_time.strftime("%Y-%m-%d %H:%M:%S")
        try:
            # Connect to the MySQL database
            cursor = connection.cursor()
            print("connected")

            # Insert the new information to the About table
            print("connected")
            cursor.execute("INSERT INTO About (team_num, sprint, release_date, prod_name, prod_descript) VALUES (%s,%s,%s,%s,%s)",
                           (teamNum, sprint, submit, prodName, prodDesc))
            print("executed")
            connection.commit()
            cursor.execute(last_user_query)
            connection.close()
            return jsonify({'message': 'About updated successfully'}), 200
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500
# route to get reasons for company


@api.route('/company/reasons/<user_id>', methods=['GET'])
def reason(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    print("connected")
    query = "select company_id from User_Org where user_id = " + user_id + " LIMIT 1;"
    cursor.execute(query)
    company_id = cursor.fetchone()
    print(company_id)
    cursor.close()
    cursor2 = connection.cursor()
    query2 = "select * from Reason where company_id = " + \
        str(company_id[0]) + ";"
    cursor2.execute(query2)
    reasons = cursor2.fetchall()
    reason_list = []
    for reason in reasons:
        reason_data = {
            'reason_id': reason[0],
            'reason': reason[1],
            'company_id': reason[2],
        }
        reason_list.append(reason_data)
        print(reason_list)
    cursor2.close()
    if reason_list:
        connection.close()
        return jsonify({"reasons": reason_list})
    else:
        connection.close()
        return jsonify({'error': 'Applications not found'}), 404
# route to get drivers for company


@api.route('/company/users/<user_id>', methods=['GET'])
def company_users(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    print("connected")
    query = "select company_id from User_Org where user_id = " + user_id + " LIMIT 1;"
    cursor.execute(query)
    company_id = cursor.fetchone()
    print(company_id)
    cursor.close()
    cursor2 = connection.cursor()
    query2 = "select u.fname, u.lname, d.points, d.user_id, u.accountStatus from Driver d INNER JOIN Users u ON d.user_id = u.user_id where d.company_id = " + \
        str(company_id[0]) + ";"
    cursor2.execute(query2)
    drivers = cursor2.fetchall()
    driver_list = []
    for driver in drivers:
        driver_data = {
            'fname': driver[0],
            'lname': driver[1],
            'points': driver[2],
            'user_id': driver[3],
            'accountStatus':driver[4],
        }
        driver_list.append(driver_data)
        print(driver_list)
    cursor2.close()
    if driver_list:
        connection.close()
        return jsonify({"drivers": driver_list})
    else:
        connection.close()
        return jsonify({'error': 'Applications not found'}), 404
# route to add driver once application is accepted


@api.route('/add/driver/admin', methods=['POST'])
def add_driver():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        user_id = data.get('user_id')
        company_id = data.get('company_id')
        print(user_id)
        print(company_id)
        try:
            # Connect to the MySQL database
            cursor2 = connection.cursor()
            # Insert the new user into the Users table
            print("connected")
            cursor2.execute("INSERT INTO Driver (company_id, user_id, points) VALUES (%s,%s,%s)",
                            (company_id, user_id, 0.0))
            print("test")
            connection.commit()
            cursor2.close()
            connection.close()
            return jsonify({'message': 'Driver added successfully'}), 200
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500

# route to add points to driver
@api.route('/add/points/<user_id>', methods=['POST'])
def remove_points(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        points = float(data.get('points'))
        driver_id = int(data.get('driver_id'))
        reason = int(data.get('reason'))
        print(user_id)
        print(points)
        print(type(points))
        print(reason)
        print(type(reason))
        print(driver_id)
        print(type(driver_id))
        current_time = datetime.now()
        submit = current_time.strftime("%Y-%m-%d %H:%M:%S")
        # license = data.get('licenseNum')
        try:
            cursor = connection.cursor()
            # Insert the new user into the Users table
            print("connected")
            cursor.execute("INSERT INTO PointRule (driver_id, sponsor_id, reason_id, pointTime, actions, numPoints) VALUES (%s,%s,%s,%s,%s,%s)",
                           (driver_id, int(user_id), reason, submit, "added", points))
            print("test")
            connection.commit()
            cursor.close()

            cursor3 = connection.cursor()
            cursor3.execute(
                "SELECT company_id FROM Reason where reason_id = " + str(reason) + ";")
            company = cursor3.fetchone()
            print(company)
            print(company[0])
            cursor3.close()

            cursor2 = connection.cursor()
            query2 = "SELECT points FROM Driver WHERE user_id = " + \
                str(driver_id) + " and company_id = " + str(company[0]) + ";"
            cursor2.execute(query2)
            old_points = cursor2.fetchone()
            print(old_points)
            new_points = old_points[0] + points
            print(new_points)
            cursor2.close()
            cursor3 = connection.cursor()
            update_query = "UPDATE Driver SET points = %s WHERE user_id = %s and company_id = %s"
            cursor3.execute(
                update_query, (new_points, driver_id, str(company[0])))
            cursor3.close()
            connection.commit()
            connection.close()
            return jsonify({'message': 'Driver points updated successfully'}), 200
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500

# route to remove points from driver


@api.route('/remove/points/<user_id>', methods=['POST'])
def add_points(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        points = float(data.get('points'))
        driver_id = int(data.get('driver_id'))
        reason = int(data.get('reason'))

        current_time = datetime.now()
        submit = current_time.strftime("%Y-%m-%d %H:%M:%S")
        # license = data.get('licenseNum')
        try:
            cursor = connection.cursor()
            # Insert the new user into the Users table
            print("connected")
            cursor.execute("INSERT INTO PointRule (driver_id, sponsor_id, reason_id, pointTime, actions, numPoints) VALUES (%s,%s,%s,%s,%s,%s)",
                           (driver_id, int(user_id), reason, submit, "removed", points))
            print("test")
            connection.commit()
            cursor.close()

            cursor3 = connection.cursor()
            cursor3.execute(
                "SELECT company_id FROM Reason where reason_id = " + str(reason) + ";")
            company = cursor3.fetchone()
            print(company)
            print(company[0])
            cursor3.close()

            cursor2 = connection.cursor()
            query2 = "SELECT points FROM Driver WHERE user_id = " + \
                str(driver_id) + " and company_id = " + str(company[0]) + ";"
            cursor2.execute(query2)
            old_points = cursor2.fetchone()
            print(old_points)
            new_points = old_points[0] - points
            print(new_points)
            cursor2.close()
            cursor3 = connection.cursor()
            update_query = "UPDATE Driver SET points = %s WHERE user_id = %s and company_id = %s"
            cursor3.execute(
                update_query, (new_points, driver_id, str(company[0])))
            cursor3.close()
            connection.commit()
            connection.close()
            return jsonify({'message': 'Driver points updated successfully'}), 200
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500
# route to add reason for sponsors


@api.route('/add/reason/<user_id>', methods=['POST'])
def add_reason(user_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        reason = data.get('reason')
        try:
            cursor2 = connection.cursor()
            query = "select company_id from User_Org where user_id = " + user_id + " LIMIT 1;"
            cursor2.execute(query)
            company_id = cursor2.fetchone()
            cursor2.close()

            cursor = connection.cursor()
            cursor.execute("INSERT INTO Reason (reason, company_id) VALUES (%s,%s)",
                           (reason, company_id[0]))
            connection.commit()
            cursor.close()
            return jsonify({'message': 'Reason added successfully'}), 200
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500

# route to get reasons for admins


@api.route('/admin/reasons', methods=['GET'])
def admin_reason():
    connection = mysql.connector.connect(**db_config)
    print("connected")
    cursor2 = connection.cursor()
    query2 = "select r.reason_id, r.reason, r.company_id, c.company_name from Reason r INNER JOIN Company c ON r.company_id = c.company_id;"
    cursor2.execute(query2)
    reasons = cursor2.fetchall()
    reason_list = []
    for reason in reasons:
        reason_data = {
            'reason_id': reason[0],
            'reason': reason[1],
            'company_id': reason[2],
            'company_name': reason[3]
        }
        reason_list.append(reason_data)
        print(reason_list)
    cursor2.close()
    if reason_list:
        connection.close()
        return jsonify({"reasons": reason_list})
    else:
        connection.close()
        return jsonify({'error': 'Applications not found'}), 404

# route to add reason for admins


@api.route('/add/reason/admin/<company_id>', methods=['POST'])
def add_reason_admin(company_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        reason = data.get('reason')
        print(company_id)
        try:

            cursor = connection.cursor()
            cursor.execute("INSERT INTO Reason (reason, company_id) VALUES (%s,%s)",
                           (reason, company_id))
            connection.commit()
            cursor.close()
            return jsonify({'message': 'Reason added successfully'}), 200
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500


@api.route('/audit_log/<user_role>/<user_id>', methods=['GET'])
@cross_origin(origins={"*"})
def get_audit_log(user_role, user_id):
    try:
        # Connect to the MySQL database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        user_role = int(user_role.strip())
        user_id = int(user_id.strip())
        print('Role =', user_role)
        print('ID =', user_id)

        if user_role == 3:
            # Fetch data from the NewUser table
            cursor.execute("SELECT * FROM NewUser")
            new_users_result = cursor.fetchall()

            # Fetch data from the Logon table
            cursor.execute("SELECT * FROM Logon")
            logons_result = cursor.fetchall()

            # Fetch data from the BadLogin table
            cursor.execute("SELECT * FROM BadLogin")
            bad_logins_result = cursor.fetchall()

            # Fetch data from the AppStat table
            cursor.execute("""SELECT 
                                A.stamp AS date,
                                A.sponsor_id AS sponsor,
                                D.driver_id AS driver,
                                D.stat AS status,
                                A.reason
                            FROM 
                                AppStat A
                            INNER JOIN 
                                DriverApp D ON A.driverapp_id = D.driverapp_id;""")
            app_stat_result = cursor.fetchall()

            # Fetch data from the PointRule table
            cursor.execute("SELECT * FROM PointRule")
            point_changes_result = cursor.fetchall()

            # Fetch data from the PassChange table
            cursor.execute("SELECT * FROM PassChange")
            pass_changes_result = cursor.fetchall()

        elif user_role == 2:  # Sponsor
            # Determine the company associated with the sponsor
            cursor.execute(
                "SELECT company_id FROM User_Org WHERE user_id = %s", (user_id,))
            company_id = cursor.fetchone()[0]
            print(company_id)

            # Find drivers/users associated with the company
            cursor.execute(
                "SELECT user_id FROM Driver WHERE company_id = %s", (company_id,))
            user_ids = [row[0] for row in cursor.fetchall()]
            print(user_ids)

            # Generate a string of placeholders (?, ?, ?) based on the length of user_ids
            placeholders = ', '.join(['%s' for _ in range(len(user_ids))])

            # Modify the SQL query to use the placeholders and pass user_ids as a flat tuple
            newUserquery = f"SELECT * FROM NewUser WHERE user_id IN ({placeholders})"
            cursor.execute(newUserquery, tuple(user_ids))
            new_users_result = cursor.fetchall()

            # Fetch data from the Logon table
            logonQuery = f"SELECT * FROM Logon WHERE user_id IN ({placeholders})"
            cursor.execute(logonQuery, tuple(user_ids))
            logons_result = cursor.fetchall()

            # Sponsors don't need the BadLogin table
            bad_logins_result = []

            # Fetch data from the AppStat table
            appStatquery = f"""SELECT 
                                A.stamp AS date,
                                A.sponsor_id AS sponsor,
                                D.driver_id AS driver,
                                D.stat AS status,
                                A.reason
                            FROM 
                                AppStat A
                            INNER JOIN 
                                DriverApp D ON A.driverapp_id = D.driverapp_id
                            WHERE 
                                D.driver_id IN ({placeholders})"""
            cursor.execute(appStatquery, tuple(user_ids))
            app_stat_result = cursor.fetchall()

            # Fetch data from the PointRule table
            cursor.execute(
                "SELECT * FROM PointRule WHERE sponsor_id = %s", (user_id,))
            point_changes_result = cursor.fetchall()

            # Fetch data from the PassChange table
            passChangequery = f"SELECT * FROM PassChange WHERE user_id IN ({placeholders})"
            cursor.execute(passChangequery, tuple(user_ids))
            pass_changes_result = cursor.fetchall()

        # Convert query results to dictionary format
        new_users_data = [{'audit_id': row[0], 'user_id': row[1],
                           'event_description': row[2]} for row in new_users_result]
        logons_data = [{'logon_id': row[0], 'user_id': row[1],
                        'stamp': row[2]} for row in logons_result]  # New line
        bad_logins_data = [{'login_id': row[0], 'event_description': row[1],
                            'stamp': row[2]} for row in bad_logins_result]
        app_stat_data = [{'date': row[0], 'sponsor': row[1], 'driver': row[2],
                          'status': row[3], 'reason': row[4]} for row in app_stat_result]
        point_changes_data = [{'point_id': row[0], 'sponsor_id': row[1], 'driver_id': row[2], 'reason_id': row[3],
                               'pointTime': row[4], 'actions': row[5], 'numPoints': row[6]} for row in point_changes_result]
        pass_changes_data = [{'passchange_id': row[0], 'user_id': row[1],
                              'type_change': row[2], 'stamp': row[3]} for row in pass_changes_result]

        cursor.close()
        connection.close()

        return jsonify({'new_users': new_users_data, 'logons': logons_data, 'bad_logins': bad_logins_data, 'app_stat': app_stat_data, 'point_changes': point_changes_data, 'pass_changes': pass_changes_data})

    except Exception as e:
        cursor.close()
        connection.close()
        print("Error fetching audit log data:", e)
        return jsonify({'error': 'Failed to fetch audit log data'})


@api.route('/Cart/<user_id>/<company_id>', methods=['GET'])
@cross_origin(origin='*')
def get_cart(user_id, company_id):
    # Connect to the MySQL database
    print("Connecting to cart route")
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    print("Connected to cart route")

    cursor.execute("SELECT * FROM Cart Where user_id = %s AND company_id = %s", (user_id, company_id,))
    cart_result = cursor.fetchall()
    print("Got Cart")
    cart_list = []
    for cart in cart_result:
        cart_data = {
            'cart_id': cart[0],
            'user_id': cart[1],
            'prod_id': cart[2],
            'prod_title': cart[3],
            'prod_image': cart[4],
            'prod_cost': cart[5]
        }
        cart_list.append(cart_data)
        # print(cart_list)
    print("Finished")
    cursor.close()
    if cart_list:
        cursor.close()
        connection.close()
        return jsonify({"cart": cart_list})
    else:
        cursor.close()
        connection.close()
        return jsonify({'error': 'Cart stuff not found'}), 404


@api.route('/Cart/<user_id>/<cart_id>/<company_id>', methods=['DELETE'])
@cross_origin(origin='*')
def remove_from_cart(user_id, cart_id, company_id):
    try:
        # Connect to the MySQL database
        print("Connecting to remove from cart route")
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        print("Connected to remove from cart route")

        # Execute SQL query to remove item from the cart
        cursor.execute(
            "DELETE FROM Cart WHERE cart_id = %s AND user_id = %s AND company_id = %s", (cart_id, user_id, company_id))
        connection.commit()  # Commit the transaction

        print("Item removed from cart")
        cursor.close()
        connection.close()
        return jsonify({'message': 'Item removed from cart successfully'})
    except Exception as e:
        print("Error removing item from cart:", e)
        cursor.close()
        connection.close()
        return jsonify({'error': 'Failed to remove item from cart'}), 500

@api.route('/add_order', methods=['POST'])
@cross_origin(origin='*')
def add_order():
    try:
        # Connect to the MySQL database
        print("Adding order")
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Extract data from the request
        data = request.json
        user_id = data.get('user_id')
        total_cost = data.get('total_cost')
        cart_items = data.get('cart_items')
        company_id = data.get('company_id')  # Get the company_id from the request data
        print(user_id)
        print(total_cost)
        print(cart_items)
        print(company_id)

        # Get user's information from the Users table
        cursor.execute(
            "SELECT fname, lname, email FROM Users WHERE user_id = %s", (user_id,))
        user_info = cursor.fetchone()
        fname, lname, email = user_info
        print(fname)
        print(lname)
        print(email)

        # Get driver's information from the Driver table
        cursor.execute(
            "SELECT driver_id FROM Driver WHERE user_id = %s AND company_id = %s", (user_id, company_id,))
        driver_id = cursor.fetchone()[0]
        print("DRIVER ID:", driver_id)

        # Get driver's information from the Driver table
        cursor.execute(
            "SELECT points FROM Driver WHERE user_id = %s AND company_id = %s", (user_id, company_id,))
        driver_points = cursor.fetchone()[0]
        print("POINTS:", driver_points)

        # Check if driver has enough points for the order
        if driver_points < total_cost:
            raise Exception("Driver does not have enough points for this order")

        # Subtract the total cost of the order from the driver's points
        updated_points = driver_points - total_cost

        # Update the driver's points in the database
        cursor.execute("UPDATE Driver SET points = %s WHERE driver_id = %s", (updated_points, driver_id))
        connection.commit()

        # Insert the order into the Orders table
        cursor.execute("INSERT INTO Orders (driver_id, total_cost, stamp, order_status, company_id) VALUES (%s, %s, %s, %s, %s)",
                       (driver_id, total_cost, datetime.now(), 0, company_id))
        order_id = cursor.lastrowid
        print("ORDER_ID:", order_id)
        connection.commit()

        # Insert each item into the Item table
        print("INSERTING INTO ITEM TABLE")
        for item in cart_items:
            cursor.execute("INSERT INTO Item (prod_id, prod_title, prod_cost, order_id) VALUES (%s, %s, %s, %s)",
                           (item['prod_id'], item['prod_title'], item['prod_cost'], order_id))
        connection.commit()

        cursor.close()
        connection.close()
        return jsonify({'success': True, 'message': 'Order added successfully'})
    except Exception as e:
        print(f"Error adding order: {e}")
        cursor.close()
        connection.close()
        return jsonify({'success': False, 'error': str(e)}), 500


@api.route('/get_orders/<user_role>/<user_id>', methods=['GET'])
@cross_origin(origin='*')
def get_orders(user_role, user_id):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        user_role = int(user_role.strip())
        user_id = int(user_id.strip())
        print('Role =', user_role)
        print('ID =', user_id)

        if user_role == 1:  # Driver
            cursor.execute("""
                SELECT Orders.order_id, Users.fname, Users.lname, Users.email, Orders.total_cost, Orders.stamp, Orders.order_status
                FROM Orders
                JOIN Driver ON Orders.driver_id = Driver.driver_id
                JOIN Users ON Driver.user_id = Users.user_id
                WHERE Driver.user_id = %s
            """, (user_id,))
        elif user_role == 2:  # Sponsor
            # Determine the company associated with the sponsor
            cursor.execute(
                "SELECT company_id FROM User_Org WHERE user_id = %s", (user_id,))
            company_id = cursor.fetchone()[0]
            print(company_id)

            # Find drivers/users associated with the company
            cursor.execute(
                "SELECT user_id FROM Driver WHERE company_id = %s", (company_id,))
            user_ids = [row[0] for row in cursor.fetchall()]
            print(user_ids)

            # Generate a string of placeholders (?, ?, ?) based on the length of user_ids
            placeholders = ', '.join(['%s' for _ in range(len(user_ids))])

            # Fetch orders for the drivers associated with the sponsor
            cursor.execute("""
                SELECT Orders.order_id, Users.fname, Users.lname, Users.email, Orders.total_cost, Orders.stamp, Orders.order_status
                FROM Orders
                JOIN Driver ON Orders.driver_id = Driver.driver_id
                JOIN Users ON Driver.user_id = Users.user_id
                WHERE Driver.user_id IN ({})
            """.format(placeholders), tuple(user_ids))
        else:  # Admin
            cursor.execute("""
                SELECT Orders.order_id, Users.fname, Users.lname, Users.email, Orders.total_cost, Orders.stamp, Orders.order_status
                FROM Orders
                JOIN Driver ON Orders.driver_id = Driver.driver_id
                JOIN Users ON Driver.user_id = Users.user_id
            """)

        orders_data = cursor.fetchall()

        cursor.close()
        connection.close()

        orders = []
        for order in orders_data:
            order_info = {
                'order_id': order[0],
                'first_name': order[1],
                'last_name': order[2],
                'email': order[3],
                'total_cost': order[4],
                'timestamp': order[5],
                'order_status': order[6]
            }
            orders.append(order_info)

        return jsonify({"orders": orders})
    except Exception as e:
        cursor.close()
        connection.close()
        return jsonify({'error': str(e)}), 500


@api.route('/update_order_status/<order_id>', methods=['POST'])
@cross_origin(origin='*')
def update_order_status(order_id):
    new_status = request.json.get('newStatus')

    try:
        print("UPDATING STATUS")
        # Connect to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Get the driver_id and company_id associated with the order
        cursor.execute("SELECT driver_id, company_id, total_cost FROM Orders WHERE order_id = %s", (order_id,))
        order_data = cursor.fetchone()
        if not order_data:
            return jsonify({"error": "Order not found."}), 404
        driver_id, company_id, total_cost = order_data

        # Check if the new status is 2 (Rejected) or 3 (Canceled)
        if new_status in (2, 3):
            print("REFUNDING POINTS")
            # Retrieve the current points of the driver for the specific company
            cursor.execute("SELECT points FROM Driver WHERE driver_id = %s AND company_id = %s", (driver_id, company_id))
            current_points = cursor.fetchone()[0]
            print(current_points)
            print(total_cost)

            # Add the total cost of the order back to the driver's points for that company
            # print("new points = current + total:", new_points, current_points, total_cost)
            new_points = current_points + total_cost
            cursor.execute("UPDATE Driver SET points = %s WHERE driver_id = %s AND company_id = %s", (new_points, driver_id, company_id))

        # Update the order status
        update_query = "UPDATE Orders SET order_status = %s WHERE order_id = %s"
        cursor.execute(update_query, (new_status, order_id))

        connection.commit()

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return jsonify({"message": "Order status updated successfully.", "pointsRefunded": total_cost}), 200
    except Exception as e:
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500


@api.route('/points', methods=['GET'])
def get_points():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()


@api.route('/change_pass', methods=['POST'])
@cross_origin(origins={"*"})
def change_password():
    try:
        # Get request data
        data = request.json
        user_id = data.get('user_id')
        message = data.get('message')

        # Connect to the MySQL database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Insert password change information into PassChange table
        cursor.execute(
            "INSERT INTO PassChange (user_id, type_change, stamp) VALUES (%s, %s, NOW())", (user_id, message))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({'success': True})

    except Exception as e:
        print("Error changing password:", e)
        return jsonify({'error': 'Failed to change password'})

# route to get point change information


@api.route('/pointchange', methods=['GET'])
def point_change():
    connection = mysql.connector.connect(**db_config)
    print("connected")
    cursor2 = connection.cursor()
    query2 = "select p.point_id, CONCAT(u.fname, ' ',u.lname) AS 'driver', CONCAT(s.fname,' ',s.lname) AS 'sponsor', p.pointTime, r.reason, p.actions, p.numPoints from PointRule p INNER JOIN Users u INNER JOIN Users s INNER JOIN Reason r ON p.sponsor_id = s.user_id and p.driver_id = u.user_id and p.reason_id = r.reason_id; "
    cursor2.execute(query2)
    reasons = cursor2.fetchall()
    reason_list = []
    for reason in reasons:
        reason_data = {
            'point_id': reason[0],
            'driver': reason[1],
            'sponsor': reason[2],
            'reason': reason[4],
            'pointTime': reason[3],
            'actions': reason[5],
            'numPoints': reason[6]
        }
        reason_list.append(reason_data)
        print(reason_list)
    cursor2.close()
    if reason_list:
        connection.close()
        return jsonify({"changes": reason_list})
    else:
        connection.close()
        return jsonify({'error': 'Point changes not found'}), 404
    
# point conversions for companies
@api.route('/point/conversion/<user_id>', methods=['POST'])
def add_point_conversion(user_id):
    connection = mysql.connector.connect(**db_config)
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        points = float(data.get('points'))
        money = float(data.get('money'))
        print(points)
        print(money)
        print(user_id)
        try:
            # get company id
            cursor2 = connection.cursor()
            query = "select company_id from User_Org where user_id = " + user_id + " LIMIT 1;"
            cursor2.execute(query)
            company_id = cursor2.fetchone()
            cursor2.close()

            cursor = connection.cursor()
            cursor.execute("INSERT INTO PointConversion (company_id, points, money) VALUES (%s,%s,%s)",
                           (str(company_id[0]), points, money))
            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({'message': 'Reason added successfully'}), 200
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500
        
# admin point conversions for companies
@api.route('/point/conversion/admin', methods=['POST'])
def add_point_conversion_admin():
    connection = mysql.connector.connect(**db_config)
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        points = float(data.get('points'))
        money = float(data.get('money'))
        company_id = data.get('company_id')
        print(points)
        print(money)
        print(company_id)
        try:

            cursor = connection.cursor()
            cursor.execute("INSERT INTO PointConversion (company_id, points, money) VALUES (%s,%s,%s)",
                           (company_id, points, money))
            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({'message': 'Conversion added successfully'}), 200
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500


@api.route('/add/sponsor/<user_id>', methods=['POST'])
def add_sponsor(user_id):
    connection = mysql.connector.connect(**db_config)
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        fname = data.get('fname')
        print(fname)
        lname = data.get('lname')
        print(lname)
        userType = data.get('userType')
        print(userType)
        password = data.get('password')
        dob = data.get('dob')
        print(dob)
        email = data.get('email')
        print(email)
        address = data.get('address')
        print(address)
        print("userid " + user_id)
        try:
            cursor = connection.cursor()
            print("connected")

            # Check if the email already exists in the database
            cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
            print("select succeeded")
            existing_user = cursor.fetchone()
            print("fetched successfully")

            if existing_user:
                # If email already exists, return an error response
                print("bad email")
                return jsonify({'error': 'Email already in use'}), 400

            # Insert the new user into the Users table
            print("connected")
            cursor.execute("INSERT INTO Users (fname, lname, userType, email, dob, accountStatus) VALUES (%s,%s,%s,%s,%s,%s)",
                           (fname, lname, userType, email, dob, 1))
            print("test")
            connection.commit()
            # get company id
            cursor2 = connection.cursor()
            query = "select company_id from User_Org where user_id = " + user_id + " LIMIT 1;"
            cursor2.execute(query)
            company_id = cursor2.fetchone()
            cursor2.close()
            # get latest user_id
            cursor3 = connection.cursor()
            query2 = "SELECT LAST_INSERT_ID()"
            cursor3.execute(query2)
            user = cursor3.fetchone()
            cursor3.close()
            print(str(user[0]))
            print("company: " + str(company_id))
            cursor4 = connection.cursor()
            cursor4.execute("INSERT INTO User_Org (user_id,company_id) VALUES (%s,%s)",
                            (str(user[0]), str(company_id[0])))
            connection.commit()
            cursor4.close()
            connection.close()
            return jsonify({'message': 'Sponsor added successfully'}), 200
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500


@api.route('/admin/add/sponsor', methods=['POST'])
def admin_add_sponsor():
    connection = mysql.connector.connect(**db_config)
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        fname = data.get('fname')
        print(fname)
        lname = data.get('lname')
        print(lname)
        userType = data.get('userType')
        print(userType)
        password = data.get('password')
        dob = data.get('dob')
        print(dob)
        email = data.get('email')
        print(email)
        address = data.get('address')
        print(address)
        company = data.get('company')
        try:
            cursor = connection.cursor()
            print("connected")

            # Check if the email already exists in the database
            cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
            print("select succeeded")
            existing_user = cursor.fetchone()
            print("fetched successfully")

            if existing_user:
                # If email already exists, return an error response
                print("bad email")
                return jsonify({'error': 'Email already in use'}), 400

            # Insert the new user into the Users table
            print("connected")
            cursor.execute("INSERT INTO Users (fname, lname, userType, email, dob, accountStatus) VALUES (%s,%s,%s,%s,%s,%s)",
                           (fname, lname, userType, email, dob, 1))
            print("test")
            connection.commit()

            # get latest user_id
            cursor3 = connection.cursor()
            query2 = "SELECT LAST_INSERT_ID()"
            cursor3.execute(query2)
            user = cursor3.fetchone()
            cursor3.close()
            print(str(user[0]))

            cursor4 = connection.cursor()
            cursor4.execute("INSERT INTO User_Org (user_id,company_id) VALUES (%s,%s)",
                            (str(user[0]), company))
            connection.commit()
            cursor4.close()
            connection.close()
            return jsonify({'message': 'Sponsor added successfully'}), 200
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500
# route to add company


@api.route('/add_company', methods=['POST'])
def add_company():
    connection = mysql.connector.connect(**db_config)
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        name = data.get('name')
        print(name)
        print(type(name))
        email = data.get('email')
        print(email)
        print(type(email))
        try:

            cursor4 = connection.cursor()
            cursor4.execute("INSERT INTO Company (company_name,company_email) VALUES (%s,%s)",
                            (name, email))
            connection.commit()
            cursor4.close()
            connection.close()
            return jsonify({'message': 'Company added successfully'}), 200
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500

# route to get point change information


@api.route('/pointchange/<spon_id>', methods=['GET'])
def spon_point_change(spon_id):
    connection = mysql.connector.connect(**db_config)
    print("connected")
    cursor = connection.cursor()
    query = "select company_id from User_Org where user_id = " + spon_id + " LIMIT 1;"
    cursor.execute(query)
    company_id = cursor.fetchone()
    cursor.close()

    cursor2 = connection.cursor()
    query2 = "select p.point_id, CONCAT(u.fname, ' ',u.lname) AS 'driver', CONCAT(s.fname,' ',s.lname) AS 'sponsor', p.pointTime, r.reason, p.actions, p.numPoints from PointRule p INNER JOIN Users u INNER JOIN Users s INNER JOIN Reason r INNER JOIN User_Org o ON p.sponsor_id = s.user_id and p.driver_id = u.user_id and o.user_id = s.user_id and p.reason_id = r.reason_id WHERE o.company_id = " + str(
        company_id[0]) + ";"
    cursor2.execute(query2)
    reasons = cursor2.fetchall()
    reason_list = []
    for reason in reasons:
        reason_data = {
            'point_id': reason[0],
            'driver': reason[1],
            'sponsor': reason[2],
            'reason': reason[4],
            'pointTime': reason[3],
            'actions': reason[5],
            'numPoints': reason[6]
        }
        reason_list.append(reason_data)
        print(reason_list)
    cursor2.close()
    if reason_list:
        connection.close()
        return jsonify({"changes": reason_list})
    else:
        connection.close()
        return jsonify({'error': 'Point changes not found'}), 404
# fix


@api.route('/disable/user', methods=['POST'])
def disable_user():
    connection = mysql.connector.connect(**db_config)
    try:
        # Get data from the request
        data = request.json
        userid = data.get('userid')
        print(userid)
        print(type(userid))
        stat = data.get('stat')
        print(stat)
        print(type(stat))
        stat = int(stat)
        newstat = 1 if stat == 0 else 0
        print(newstat)
        print(type(newstat))
        cursor = connection.cursor()
        print("connected")
        cursor.execute(
            "UPDATE Users SET accountStatus = %s WHERE user_id = %s", (newstat, userid))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({'message': 'Status changed successfully'}), 200

    except Exception as e:
        # cursor.close()
        # connection.close()
        return jsonify({'error': str(e)}), 500
    
@api.route('/admin/app/pending', methods=['GET'])
def get_admin_pending_apps():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "select u.fname, u.lname, c.company_name, d.stat, d.driverapp_id, d.submitted, d.company_id, c.company_name from DriverApp d INNER JOIN Users u INNER JOIN Company c WHERE d.company_id = c.company_id and d.driver_id = u.user_id and d.stat = 2;"
    cursor.execute(query)
    apps = cursor.fetchall()
    app_list = []
    for app in apps:
        app_data = {
            'fname': app[0],
            'lname': app[1],
            'company_name': app[2],
            'stat': app[3],
            'driverapp_id': app[4],
            'submit': app[5],
            'company_id': app[6],
            'company_name': app[7]
        }
        app_list.append(app_data)
        #print(app_list)
    cursor.close()
    connection.close()
    return jsonify({"applications": app_list})

@api.route('/admin/add/driver', methods=['POST'])
def admin_add_driver():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        user_id = data.get('user_id')
        company_id = data.get('company_id')
        print(company_id)
        print(user_id)
        print("test")
        # license = data.get('licenseNum')
        try:
            cursor2 = connection.cursor()
            # Insert the new user into the Users table
            print("connected")
            cursor2.execute("INSERT INTO Driver (company_id, user_id, points) VALUES (%s,%s,%s)",
                            (company_id, user_id, 0.1))
            print("test")
            connection.commit()
            cursor2.close()
            connection.close()
            return jsonify({'message': 'Driver added successfully'}), 200
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500


@api.route('/set_company_preferences/<user_id>', methods=['POST'])
def set_company_preferences(user_id):
    try:
        # Extract data from the request
        # user_role = request.json.get('user_role')
        # Assuming this is a list of media types
        media_types = request.json.get('media_types')
        print(user_id)
        print(media_types)

        # Connect to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Retrieve the company_id based on user_id or user_role
        if user_id:
            cursor.execute(
                "SELECT company_id FROM User_Org WHERE user_id = %s", (user_id,))
        # elif user_role:
        #     cursor.execute("SELECT company_id FROM User_Org WHERE user_role = %s", (user_role,))
        else:
            return jsonify({'error': 'No user_id or user_role provided'}), 400

        company_id = cursor.fetchone()[0]
        print(company_id)

        # Delete existing preferences for the company
        cursor.execute(
            "DELETE FROM Mediatypes WHERE company_id = %s", (company_id,))

        # Insert new preferences into the Mediatypes table
        for media_type in media_types:
            cursor.execute(
                "INSERT INTO Mediatypes (company_id, media_type) VALUES (%s, %s)", (company_id, media_type))

        # Commit changes and close the connection
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'Company preferences set successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/get_company_preferences/<user_id>/<company_id>', methods=['GET'])
def get_company_preferences(user_id, company_id):
    try:
        # Ensure user_id is properly formatted as an integer
        user_id = int(user_id.strip())
        company_id = int(company_id.strip())
        print("Getting preferences for user:", user_id)
        print(type(user_id))

        # Connect to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Retrieve the company_id associated with the user_id from the Driver table
        # cursor.execute(
        #     "SELECT company_id FROM Driver WHERE user_id = %s", (user_id,))
        # result = cursor.fetchone()

        # if result:
        #     company_id = result[0]
        #     print("Found company:", company_id)
        #     print(type(company_id))

            # Consume all results from the first query before executing the next query
            # print("Attempting to flush cursor")
            # cursor.fetchall()

            # Retrieve the media types approved by the company from the MediaTypes table
        print("Attempting to retrieve media types")
        cursor.execute(
            "SELECT media_type FROM Mediatypes WHERE company_id = %s", (company_id,))
        media_types = [row[0] for row in cursor.fetchall()]
        print("Media types:", media_types)

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return jsonify({'company_id': company_id, 'media_types': media_types}), 200
        # else:
        #     return jsonify({'error': 'Company ID not found for user'}), 404

    except mysql.connector.Error as e:
        # Log the specific database error
        print("Database error:", e)
        return jsonify({'error': 'Database error'}), 500

    except ValueError:
        # Handle invalid user_id format
        return jsonify({'error': 'Invalid user ID format'}), 400

    except Exception as e:
        # Log any other unexpected exceptions
        print("Error:", e)
        return jsonify({'error': 'Internal server error'}), 500


# @api.route('/edited/user', methods=['POST'])
# def edited_user():
#     connection = mysql.connector.connect(**db_config)
#     try:
#         # Get data from the request
#         data = request.json
#         user_id = data.get('user_id')
#         fname = data.get('fname')
#         lname = data.get('lname')
#         email = data.get('email')

#         cursor = connection.cursor()
#         cursor.execute("UPDATE Users SET fname = %s, lname = %s, email = %s WHERE user_id = %s",
#                        (fname, lname, email, user_id))
#         connection.commit()
#         cursor.close()
#         connection.close()
#         return jsonify({'message': 'User information updated successfully'}), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# @api.route('/increment_failed_attempts', methods=['POST'])
# def increment_failed_attempts():
#     # Connect to the MySQL database
#     connection = mysql.connector.connect(**db_config)
#     # Get data from the request
#     data = request.json
#     email = data.get('email')

#     try:
#         cursor = connection.cursor()

#         # Increment failed login attempts for the user
#         cursor.execute(
#             "UPDATE Users SET failed_login_attempts = failed_login_attempts + 1 WHERE email = %s",
#             (email,)
#         )
#         connection.commit()
#         # Check failed login attempts count
#         cursor.execute(
#             "SELECT failed_login_attempts FROM Users WHERE email = %s", (email,))
#         failed_attempts = cursor.fetchone()[0]

#         # If failed attempts exceed threshold, lock the user's account
#         if failed_attempts >= 10:
#             cursor.execute(
#                 "UPDATE Users SET accountStatus = 0 WHERE email = %s", (email,))
#             connection.commit()
#             connection.close()
#             return jsonify({'message': 'User account locked due to too many failed login attempts'}), 200

#         cursor.close()
#         connection.close()

#         return jsonify({'message': 'Failed login attempts incremented successfully'}), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


@api.route('/edited/user', methods=['POST'])
def edited_user():
    connection = mysql.connector.connect(**db_config)
    try:
        # Get data from the request
        data = request.json
        user_id = data.get('user_id')
        fname = data.get('fname')
        lname = data.get('lname')
        email = data.get('email')

        cursor = connection.cursor()
        cursor.execute("UPDATE Users SET fname = %s, lname = %s, email = %s WHERE user_id = %s",
                       (fname, lname, email, user_id))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({'message': 'User information updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500    


@api.route('/increment_failed_attempts', methods=['POST'])
def increment_failed_attempts():
    # Connect to the MySQL database
    connection = mysql.connector.connect(**db_config)
    # Get data from the request
    data = request.json
    email = data.get('email')

    try:
        cursor = connection.cursor()

        # Increment failed login attempts for the user
        cursor.execute(
            "UPDATE Users SET failed_login_attempts = failed_login_attempts + 1 WHERE email = %s",
            (email,)
        )
        connection.commit()
        # Check failed login attempts count
        cursor.execute(
            "SELECT failed_login_attempts FROM Users WHERE email = %s", (email,))
        failed_attempts = cursor.fetchone()[0]

        # If failed attempts exceed threshold, lock the user's account
        if failed_attempts >= 10:
            cursor.execute(
                "UPDATE Users SET accountStatus = 0 WHERE email = %s", (email,))
            connection.commit()
            connection.close()
            return jsonify({'message': 'User account locked due to too many failed login attempts'}), 200

        cursor.close()
        connection.close()

        return jsonify({'message': 'Failed login attempts incremented successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/sale/by/sponsor', methods=['GET'])
def sale_by_spon():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "select CONCAT(u.fname, ' ',u.lname) AS 'driver', c.company_name, o.total_cost, o.stamp, o.order_status from Orders o INNER JOIN Driver d INNER JOIN Users u INNER JOIN Company c ON d.driver_id = o.driver_id and d.user_id = u.user_id and c.company_id = d.company_id;"
    cursor.execute(query)
    companies = cursor.fetchall()
    print(companies)
    company_list = []
    for company in companies:
        company_data = {
            'driver': company[0],
            'company_name': company[1],
            'total_cost': company[2],
            'stamp': company[3],
            'order_status': company[4]
        }
        company_list.append(company_data)
    print(company_list)
    cursor.close()
    connection.close()
    res = jsonify({'sales': company_list})
    res.headers.add('Access-Control-Allow-Origin', '*')
    return res

@api.route('/point/conversion/<company_id>', methods=['GET'])
def get_point_conversion(company_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "select * from PointConversion where company_id = " + company_id + ";"
    cursor.execute(query)
    apps = cursor.fetchall()
    app_list = []
    for app in apps:
        app_data = {
            'conversion_id': app[0],
            'company_id': app[1],
            'points': app[2],
            'money': app[3],
        }
        app_list.append(app_data)
        #print(app_list)
    cursor.close()
    connection.close()
    return jsonify({"conversions": app_list})

@api.route('/get_driver_companies/<user_id>', methods=['GET'])
def get_driver_companies(user_id):
    try:
        print("Getting driver's companies")
        # Ensure user_id is properly formatted as an integer
        user_id = int(user_id.strip())
        print(user_id)

        # Connect to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Retrieve the list of company IDs associated with the user from the Driver table
        print("Attempting to retrieve the companies")
        cursor.execute(
            "SELECT DISTINCT company_id FROM Driver WHERE user_id = %s", (user_id,))
        companies = [row[0] for row in cursor.fetchall()]
        print("Got the following when getting driver's companies:", companies)

        # Close the cursor and connection
        cursor.close()
        connection.close()

        return jsonify({'companies': companies}), 200

    except mysql.connector.Error as e:
        # Log the specific database error
        print("Database error:", e)
        return jsonify({'error': 'Database error'}), 500

    except ValueError:
        # Handle invalid user_id format
        return jsonify({'error': 'Invalid user ID format'}), 400

    except Exception as e:
        # Log any other unexpected exceptions
        print("Error:", e)
        return jsonify({'error': 'Internal server error'}), 500

@api.route("/get_company_name/<company_id>", methods=["GET"])
def get_company_name(company_id):

    print("Attempting to get company name by ID")

    # Connect to the database
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # Query to fetch company name based on company ID
    cursor.execute("SELECT company_name FROM Company WHERE company_id = %s", (company_id,))
    result = cursor.fetchone()
    print(result)

    if result:
        company_name = result[0]
        # Close the cursor and connection
        cursor.close()
        connection.close()
        print("Found name:", company_name)
        return jsonify({"company_name": company_name})
    else:
        # Close the cursor and connection
        cursor.close()
        connection.close()
        return jsonify({"error": "Company not found"}), 404
    
from flask import jsonify
import mysql.connector

@api.route('/invoices', methods=['GET'])
@cross_origin(origins={"*"})
def get_invoices():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # Query to fetch company name based on company ID
    cursor.execute("select i.item_id, i.prod_id, i.prod_title, i.prod_cost, o.order_id, o.total_cost, o.stamp, o.order_status, c.company_name, c.company_id from Item i INNER JOIN Orders o INNER JOIN Driver d INNER JOIN Company c ON i.order_id = o.order_id and d.driver_id = o.driver_id and d.company_id = c.company_id;")
    apps = cursor.fetchall()
    app_list = []
    
    # Fetch the latest point-to-money conversion rate for each company
    conversion_rates = {}
    cursor.execute("SELECT company_id, points, money FROM PointConversion GROUP BY company_id ORDER BY conversion_id DESC;")
    conversions = cursor.fetchall()
    for conversion in conversions:
        company_id = conversion[0]
        points = conversion[1]
        money = conversion[2]
        conversion_rates[company_id] = {'points': points, 'money': money}
    
    for app in apps:
        app_data = {
            'item_id': app[0],
            'prod_id': app[1],
            'prod_title': app[2],
            'prod_cost': convert_to_dollars(app[3], app[9], conversion_rates),
            'order_id': app[4],
            'total_cost': convert_to_dollars(app[5], app[9], conversion_rates),
            'stamp': app[6],
            'status': app[7],
            'company_name': app[8],
            'company_id': app[9],
        }
        app_list.append(app_data)
        
    cursor.close()
    connection.close()
    
    return jsonify({"invoices": app_list})

def convert_to_dollars(amount_in_points, company_id, conversion_rates):
    if company_id in conversion_rates:
        conversion_rate = conversion_rates[company_id]
        dollars = amount_in_points / conversion_rate['points'] * conversion_rate['money']
        return dollars
    else:
        return None

@api.route('/audit_log/charts/<user_role>/<user_id>', methods=['GET'])
@cross_origin(origins={"*"})
def get_audit_log_charts(user_role, user_id):
    try:
        # Connect to the MySQL database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        user_role = int(user_role.strip())
        user_id = int(user_id.strip())
        print('Role =', user_role)
        print('ID =', user_id)

        if user_role == 3:
            # Fetch data from the NewUser table
            cursor.execute("SELECT * FROM NewUser n INNER JOIN Users u ON n.user_id = u.user_id")
            new_users_result = cursor.fetchall()

            # Fetch data from the Logon table
            cursor.execute("SELECT * FROM Logon")
            logons_result = cursor.fetchall()

            # Fetch data from the BadLogin table
            cursor.execute("SELECT * FROM BadLogin")
            bad_logins_result = cursor.fetchall()

            # Fetch data from the AppStat table
            cursor.execute("""SELECT 
                                A.stamp AS date,
                                A.sponsor_id AS sponsor,
                                D.driver_id AS driver,
                                D.stat AS status,
                                A.reason
                            FROM 
                                AppStat A
                            INNER JOIN 
                                DriverApp D ON A.driverapp_id = D.driverapp_id;""")
            app_stat_result = cursor.fetchall()

            # Fetch data from the PassChange table
            cursor.execute("SELECT * FROM PassChange")
            pass_changes_result = cursor.fetchall()

        elif user_role == 2:  # Sponsor
            # Determine the company associated with the sponsor
            cursor.execute(
                "SELECT company_id FROM User_Org WHERE user_id = %s", (user_id,))
            company_id = cursor.fetchone()[0]
            print(company_id)

            # Find drivers/users associated with the company
            cursor.execute(
                "SELECT user_id FROM Driver WHERE company_id = %s", (company_id,))
            user_ids = [row[0] for row in cursor.fetchall()]
            print(user_ids)

            # Generate a string of placeholders (?, ?, ?) based on the length of user_ids
            placeholders = ', '.join(['%s' for _ in range(len(user_ids))])

            # Modify the SQL query to use the placeholders and pass user_ids as a flat tuple
            newUserquery = f"SELECT * FROM NewUser WHERE user_id IN ({placeholders})"
            cursor.execute(newUserquery, tuple(user_ids))
            new_users_result = cursor.fetchall()

            # Fetch data from the Logon table
            logonQuery = f"""SELECT l.logon_id, l.user_id, l.stamp,u.email 
                            FROM Logon l 
                            INNER JOIN Users u ON l.user_id = u.user_id 
                            WHERE l.user_id IN ({placeholders})"""
            cursor.execute(logonQuery, tuple(user_ids))
            logons_result = cursor.fetchall()
            #print(logons_result)
            # Sponsors don't need the BadLogin table
            bad_logins_result = []

            # Fetch data from the AppStat table
            appStatquery = f"""SELECT 
                                A.stamp AS date,
                                A.sponsor_id AS sponsor,
                                D.driver_id AS driver,
                                D.stat AS status,
                                A.reason
                            FROM 
                                AppStat A
                            INNER JOIN 
                                DriverApp D ON A.driverapp_id = D.driverapp_id
                            WHERE 
                                D.driver_id IN ({placeholders})"""
            cursor.execute(appStatquery, tuple(user_ids))
            app_stat_result = cursor.fetchall()

            # Fetch data from the PointRule table
            cursor.execute(
                "SELECT * FROM PointRule WHERE sponsor_id = %s", (user_id,))
            point_changes_result = cursor.fetchall()

            # Fetch data from the PassChange table
            passChangequery = f"SELECT * FROM PassChange WHERE user_id IN ({placeholders})"
            cursor.execute(passChangequery, tuple(user_ids))
            pass_changes_result = cursor.fetchall()

        # Convert query results to dictionary format
        new_users_data = [{'audit_id': row[0], 'user_id': row[1],
                           'event_description': row[2]} for row in new_users_result]
        logons_data = [{'logon_id': row[0], 'user_id': row[1],
                        'stamp': row[2]} for row in logons_result]  # New line
        bad_logins_data = [{'login_id': row[0], 'event_description': row[1],
                            'stamp': row[2]} for row in bad_logins_result]
        app_stat_data = [{'date': row[0], 'sponsor': row[1], 'driver': row[2],
                          'status': row[3], 'reason': row[4]} for row in app_stat_result]
        pass_changes_data = [{'passchange_id': row[0], 'user_id': row[1],
                              'type_change': row[2], 'stamp': row[3]} for row in pass_changes_result]

        cursor.close()
        connection.close()

        return jsonify({'new_users': new_users_data, 'logons': logons_data, 'bad_logins': bad_logins_data, 'app_stat': app_stat_data, 'pass_changes': pass_changes_data})

    except Exception as e:
        cursor.close()
        connection.close()
        print("Error fetching audit log data:", e)
        return jsonify({'error': 'Failed to fetch audit log data'})
    
@api.route('/get_money_to_point_ratio/<company_id>', methods=['GET'])
@cross_origin(origins={"*"})
def get_money_to_point_ratio(company_id):
    try:
        print("GETTING M-P RATIO")
        # Ensure company_id is properly formatted as an integer
        company_id = int(company_id.strip())
        print(company_id)

        # Connect to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Retrieve the most recent money to point ratio for the company from the PointConversion table
        cursor.execute(
            "SELECT money FROM PointConversion WHERE company_id = %s ORDER BY conversion_id DESC LIMIT 1", (company_id,))
        money_to_point_ratio = cursor.fetchone()
        print(money_to_point_ratio)

        # Close the cursor and connection
        cursor.close()
        connection.close()

        # Check if money to point ratio exists for the company
        if money_to_point_ratio:
            return jsonify({'money_to_point_ratio': money_to_point_ratio[0]}), 200
        else:
            return jsonify({'error': 'Money to point ratio not found for the company'}), 404

    except mysql.connector.Error as e:
        # Log the specific database error
        print("Database error:", e)
        cursor.close()
        connection.close()
        return jsonify({'error': 'Database error'}), 500

    except ValueError:
        # Handle invalid company_id format
        cursor.close()
        connection.close()
        return jsonify({'error': 'Invalid company ID format'}), 400

    except Exception as e:
        # Log any other unexpected exceptions
        print("Error:", e)
        cursor.close()
        connection.close()
        return jsonify({'error': 'Internal server error'}), 500
    
@api.route('/get_driver_points/<user_id>/<company_id>', methods=['GET'])
@cross_origin(origin='*')
def get_driver_points(user_id, company_id):
    try:
        print("Getting Points for user, company: ", user_id, company_id)
        # Connect to the MySQL database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Fetch driver's points for the given company
        cursor.execute(
            "SELECT points FROM Driver WHERE user_id = %s AND company_id = %s", (user_id, company_id,))
        points = cursor.fetchone()[0]

        cursor.close()
        connection.close()

        return jsonify({'points': points}), 200
    except Exception as e:
        print(f"Error fetching driver's points: {e}")
        cursor.close()
        connection.close()
        return jsonify({'error': str(e)}), 500

@api.route('/edit_account', methods=['POST'])
def edit_account():
    connection = mysql.connector.connect(**db_config)
    if request.method == 'POST':
        # Get data from the request
        data = request.json
        user_id = data.get('user_id')
        fname = data.get('fname')
        lname = data.get('lname')
        # activity = data.get('activity')

        try:
            # Connect to the MySQL database
            cursor = connection.cursor()
            print("connected")

            # Insert the new information to the About table
            print("connected")
            cursor.execute("UPDATE Users SET fname = %s, lname = %s WHERE user_id = %s",
                       (fname, lname, user_id))
            print("executed")
            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({'message': 'Account updated successfully'}), 200
        except mysql.connector.Error as e:
            return jsonify({'error': str(e)}), 500

@api.route('/driver_dash_points/<user_id>', methods=['GET'])
@cross_origin(origin='*')
def driver_dash_points(user_id):
    try:
        # Connect to the MySQL database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Fetch driver's points and company names
        cursor.execute("""
            SELECT Driver.points, Company.company_name
            FROM Driver
            JOIN Company ON Driver.company_id = Company.company_id
            WHERE Driver.user_id = %s
        """, (user_id,))
        points_data = cursor.fetchall()
        print(points_data)

        cursor.close()
        connection.close()

        # Extract points and company names from the result set
        points = [{'points': row[0], 'company_name': row[1]} for row in points_data]

        return jsonify({'points': points}), 200
    except Exception as e:
        print(f"Error fetching driver's points: {e}")
        cursor.close()
        connection.close()
        return jsonify({'error': str(e)}), 500
