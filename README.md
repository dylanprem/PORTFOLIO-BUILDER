# PORTFOLIO-BUILDER

An app that helps you build a portfolio, and manage it in real time.

# HOW TO RUN THIS APP:

# CLONE

Clone this repo using git clone <url>

# NEW REPO

Create a new github repo, clone it and copy the contents of the portfolio builder into your new repo. Don't just drag and drop it. After that you can delete the portfolio-builder repo. The purpose of this is to push any local changes to your own repository. There are many ways to do this I'm sure but this is how to do it.

# MONGO LAB SETUP

Go to mlab.com and signup/login
On the dashboard page click create new and select the free sanbox option
add yourself as a user to your new database

# ENV VARS

create a .env file in the root directory and add the following config variables:
MONGODB_URI="Your mongodb URI from MLAB"
PORT=8080 this must be 8080 unless your change the api settings in client/src/utils/api.js
SECRET_OR_KEY=yoursecretorkey

# GITIGNORE

Create a git ignore file and and add .env and node_modules to it

# NPM INSTALL

in the root run npm i--save
then cd client and npm i --save

# RUN IT LOCAL

in the root run npm run dev

# DEPLOY TO HEROKU

install the heroku cli by running npm i -g heroku
run heroku login and login with your heroku creds
run heroku create yourappname
run heroku git:remote -a yourappname
commit your files and run git push heroku master

# ADD CONFIG VARS TO HEROKU

go to heroku.com and sign in
go to your app and click settings
click reveal config vars
add the properties and values of your .env vars here

# ACCESSING YOUR DASHBOARD

once running locally or on heroku, navigate to /register and register yourself.
then navigate to /login and login with your new credentials
Go to your dashboard -> settings and disable the register page so that no one else can access this path and make changes to your website.
Once on the dashboard, you an add projects, experience, about info, and upload safe images as well.

# CUSTOMIZE

Style our app with your own theme in client/src/portfolio.css

# Build your portfolio and enjoy!
