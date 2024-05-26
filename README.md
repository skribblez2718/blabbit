# blabbit
blabbit is a vulnerable web application requiring code analysis to discover and exploit the vulnerability. The aim is to provide a simple, yet realistic web application to practice code anlalysis skills on. This application is heavily based on projects done while doing Colt Steels's [The Web Developer Bootcamp](https://www.udemy.com/course/the-web-developer-bootcamp/) on Udemy and experience with the [Advance Web Attacks and Exploitation](https://www.offsec.com/courses/web-300/) course. It's inital use was for a CTF, but could easily be used for a self challenge as well. The goal is to obatin the flag.

## Setup
Full setup instructions are a work in progress, but there should be no gaps here that can't be filled with some simple research.

### Getting and Preparing the Application
```sh
git clone https://github.com/skribblez2718/blabbit.git
cd blabbit
npm install
```

Create a .env file in the root of this project with teh below values
```sh
# mongo configs
DB_URL=

# session configs
SESSION_SECRET=
SECURE_FLAG=

# cloudinary configs
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
CLOUDINARY_FOLDER=
```

### Mongo Setup
[MongoDB](https://www.mongodb.com/)

### Intializing data
The seeds directory consists of scripts to initlaize the database and add users, comments, etc. to make the experience more realistic. The seeds/imageURLs.js file contains URLs for your images from Cloudinary. Files in the seeds directory can be modified to your specific wants and needs.

### Running
From inside the blabbit directory run

```sh
node app.js
```

The application should now be running on http://localhost:3000. The source_code directory contains source code that would realistically be available for analysis. Use the contents of this directory for source code review

## TO DO
- Complete installation and initialization instructions along with associated scripts
- Review CSP policy to enure proper configuration

## Resources
- [The Web Developer Bootcamp](https://www.udemy.com/course/the-web-developer-bootcamp/)
- [Cloudinary](https://console.cloudinary.com)
- [MongoDB](https://www.mongodb.com/)
- [Advance Web Attacks and Exploitation](https://www.offsec.com/courses/web-300/)
