![Poster](poster.png?raw=true "Poster")

# Summary of Project

CourseWeb is a web application developed as part of the HackThis hacakthon sponsored by HackIllinois. Student users are able to register/login and can access their own dashboard where they can add courses and view upcoming assignments in their currently enrolled courses. Autograding is done instantly using NLP, for both image and text-based images and students' grades are refreshed instantaneously upon the autograding process being completed. Also developed a TA/Professor portal, where a new assignment and its grading rubric can be created by any educator.

# How to Locally Run CourseLoop


## Python dependencies 
Use `pip install <NAME_OF_LIBRARY>` to install these libraries on your machine or Python virtual environment:
- django
- djangorestframework
- Pillow
- Pyrebase
- numpy
- jieba 

<br>

## Navigate to CourseWeb/api/courseloop and run whichever of the following works on your machine/venv:
### 1. `python3 manage.py runserver 8000`
### 2. `python manage.py runserver 8000`
### 3. `./manage.py runserver 8000`
This will start the API server for CourseLoop on port 8000. (make sure you are running Python 3)



<br>

## Navigate to the CourseWeb home folder and run:
### `npm start`

Starts the React server on port 3000.<br />
Open [http://localhost:3000](http://localhost:3000) to view CourseLoop in the browser.

The page will reload if you make edits. Run **npm install** first if you haven't already.<br />

