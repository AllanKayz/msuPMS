# msuPMS

A Protype system for managing parking spaces at MSU Campus

## Software packages needed to run this webapp

 1. PostgreSQL and Postgis
 2. Nodejs

## Setting Local server

In your command prompt/terminal run the command:
     'npm install --global lite-server --save'

The above command is run without quotes. Lite server will used to run our front-end system local.

## Setting up database

 1. Import database 'msuPMS.sql' into postgres as follows;

        i. open command prompt/terminal navigate to msuPMS folder.

        ii. run the command:
                'psql -U postgres -f msupms'
        
        iii. above command is run without quotes.

### NB: Make Sure postgres path is added to windows system variable for the above command to work

## Setting Up System Configs
  
  1. Navigate to msuPMS>>Server>>Config and open the file config.ini with any text editor of your choice.

  2. Change the values User and Password to match your postgres credentials, do the same for the remaining values if they are diffirent.

## Running System

### Backend server
  
  1. In command prompt or terminal navigate to server folder.
  2. Run the command: 'npm start'
  3. Sometimes is safe to run 'npm install' first before the above command.
  4. All commands are run without quotes.
  5. If the server start successfully the command prompt/terminal will show:
        a message "App running on port 5000'
  6. Or you can open in browser url: localhost: 5000
        { info: "Node.js, Express, and Postgres API" }
     will be displayed.

### Front End Server

  1. In command prompt/terminal navigate to folder msuPMS and run the following:

        lite-server baseDir="dist/msuPMS"

  2. Lite server will be fired up on url localhost:3000
  3. Login Credentials:
        -> email: admininistrator@pmsmail.com
        -> password: admin

## FOOTNOTES

This project was build with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.4.
