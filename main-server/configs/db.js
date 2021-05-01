const mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


mysqlConnection.query(`CREATE TABLE User (
                            id int AUTO_INCREMENT PRIMARY KEY,
                            google_id varchar(36),
                            displayName varchar(100),
                            email varchar(100),
                            fistName varchar(100),
                            lastName varchar(100),
                            image varchar(255),
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                            )`)


mysqlConnection.query(`CREATE TABLE Room (
                            id int AUTO_INCREMENT PRIMARY KEY,
                            host int FOREIGN KEY REFERENCES User(id),
                            roomName varchar(100) UNIQUE,
                            status varchar(100),
                            inviteCode varchar(100),
                            room_url varchar(100),
                            isActive varchar(100) DEFAULT TRUE,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                            )`)

mysqlConnection.query(`CREATE TABLE PARTICIPANT (
                            id int AUTO_INCREMENT PRIMARY KEY,
                            user int FOREIGN KEY REFERENCES User(id),
                            room int FOREIGN KEY REFERENCES Room(id),
                            )`)

module.exports = mysqlConnection;
