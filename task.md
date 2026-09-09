Your task is to create a server with API  

Previously you created a website that saves data in localStorage and gets data from it  
This week you will have to save and retrieve data through API.  
So, you can rewrite your previous week's javascript to fetch REAL API.
Or, if you wish, you can create a new website 


Create data.json. Your users should be saved there  

So you will have this API:  
```
  a. GET /users - this API fetches users from data.json. returns array of users  
  b. POST /register - this API adds user to data.json.  
  c. POST /login - this API checks if provided username and password match.   
```
No need to write difficult code for login and register. just plain username == username and password == password check is enough  

DON'T use AI. I will know if you used ( код написан но вы не знаете как он работает, или используете функцию не понимая что она делает ).  
60% off if you used AI.


So, the project structure should be like this
```
/my project
  /frontend - here lies your frontend that fetches data from API
    html
    js
    css files
  /backend - here lies your nodeJs code, your API
    data.json - the file that contains users data
```