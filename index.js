const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Middleware to parse JSON bodies
app.use(express.json());

/*
- Create a new html file name home.html 
- Add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res) => {
  fs.readFile('./user.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading file');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

/*
- Modify /login router to accept username and password as JSON body parameters
- Read data from user.json file
- If username and password is valid, then send response as below:
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid, then send response as below:
    {
        status: false,
        message: "User Name is invalid"
    }
- If password is invalid, then send response as below:
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile('./user.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ status: false, message: 'Server error' });
    } else {
      const user = JSON.parse(data);
      if (username !== user.username) {
        res.json({ status: false, message: 'User Name is invalid' });
      } else if (password !== user.password) {
        res.json({ status: false, message: 'Password is invalid' });
      } else {
        res.json({ status: true, message: 'User Is valid' });
      }
    }
  });
});

/*
- Modify /logout route to accept username as a parameter and display message
  in HTML format like <b>${username} successfully logged out.<b>
*/
router.get('/logout/:username', (req, res) => {
  const username = req.params.username;
  res.send(`<b>${username} successfully logged out.</b>`);
});

/*
Add error handling middleware to handle errors
- Return 500 page with message "Server Error"
*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});


app.use('/', router);
app.listen(process.env.port || 8085, () => {
  console.log('Web Server is listening at port ' + (process.env.port || 8085));
});
