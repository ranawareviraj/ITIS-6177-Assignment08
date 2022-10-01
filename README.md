# ITIS-6177-Assignment08
ITIS-6177-Assignment08

=> Prepare server by running _prepare_server.sh file


=> Install and setup database

  $ mysql_secure_installation
  
      a. Current password is empty (just hit enter)
      
      b. Y set new password to: root
      
      
=> Download database preparation SQL file

  $ curl https://www.w3resource.com/sql/sample-database-of-sql-in-mysql-format.txt --output db.sql
  
  
=> Connect to DB instance and prepare database

  $ mysql -u root -p
  
    a. $ CREATE DATABASE sample;
    
    b. $ exit;
    
  $ mysql -u root -p sample < db.sql
  
  
=> Install mariadb and other dependencies

  $ npm i mariadb express
  
  $ npm install
  
  
=> Start the node application  

  $ node server.js
  

API Playground can be found here:

http://67.205.141.197:3001/api-docs/



<img width="1440" alt="image" src="https://user-images.githubusercontent.com/112779376/193423574-b12ef0c4-a625-4151-ac0f-17913695b812.png">

  
