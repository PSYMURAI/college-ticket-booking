const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const moment = require("moment-timezone");
const session = require('express-session');
const flash = require('express-flash');
const path = require('path'); // Add this line to require the 'path' module
const fs = require('fs'); 
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
app.use(express.json());
let tokenCounter = 1;

app.set('view engine', 'ejs');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}))
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydatabase',
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate the token
    const token = `mcgk${tokenCounter.toString().padStart(4, "0")}`;

    // Get the current IST time and format it
    const currentISTTime = moment
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD_HH:mm:ss");

    // Combine the token, date/time, and the original file extension
    const sanitizedTime = currentISTTime.replace(/:/g, "-");
    const newFileName = `${sanitizedTime}_${token}.${file.originalname
      .split(".")
      .pop()}`;

    cb(null, newFileName);
  },
});
const upload = multer({ storage });

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/events.html");
});



app.get('/submit', (req, res) => {
  res.render('form.ejs', { success: req.flash('success'), error: req.flash('error') });
});
app.post('/submit', upload.single('paymentImage'), (req, res) => {
  const {
    name,
    collegeName,
    mobile,
    email,
    eventDay1,
    eventDay2,
    eventDay3
  } = req.body;
  
  if (!name || !collegeName || !mobile || !email || !eventDay1 || !eventDay2 || !eventDay3) {
    req.flash('error', 'All fields are required');
    return res.redirect('/submit');
  }
  
  // Check if the mobile and email already exist in the database
  db.query('SELECT * FROM form_data WHERE mobile = ? OR email = ?', [mobile, email], (selectErr, results) => {
    if (selectErr) {
      console.error(selectErr);
      req.flash('error', 'Internal server error');
      return res.redirect('/submit');
    }
    
    if (results.length > 0) {
      console.log("mobile no not matched")
      req.flash('error', 'Mobile or email already exists');
      return res.redirect('/submit');
    }

    
    const paymentImage = req.file ? req.file.filename : '';
    
    
    const token = `mcgk${tokenCounter.toString().padStart(4, "0")}`;
    
    tokenCounter++;
    
    
    const currentISTTime = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    
    const formData = {
      name,
      collegeName,
      mobile,
      email,
      eventDay1,
      eventDay2,
      eventDay3,
      paymentImage,
      token,
      date_time_submit: currentISTTime,
    };
    
    db.query('INSERT INTO form_data SET ?', formData, (err, result) => {
      if (err) {
        req.flash('error', 'internal server error');
        return res.redirect('/submit');
      } else {
        req.flash('success', 'Form data saved to the database');
        return res.redirect('/submit');
      }
    });
  });
});














// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++admin panel api 
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++








app.use('/uploads', express.static('uploads'));

app.get('/admin/dashboard', (req, res) => {
  // Retrieve user information from your database (e.g., MySQL)
  db.query('SELECT * FROM form_data', (err, results) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Internal server error');
      return res.redirect('/admin/dashboard');
    }
    
    // Render the admin dashboard template with the user data
    res.render('admin-dashboard.ejs', { users: results  ,success: req.flash('success'), error: req.flash('error') });
  });
});


const secretKey = 'your-secret-key';

// Predefined admin credentials
const adminCredentials = {
    username: 'admin@gmail.com',
    password: 'Admin@54321',
};
app.get('/admin', (req, res) => {
  res.render("admin-login.ejs")
});
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Check admin credentials
  if (username === adminCredentials.username && password === adminCredentials.password) {
      // Generate a JWT token
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      res.json({ token });
  } else {
      res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Example protected admin dashboard route
app.get('/admin/dashboard1', (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
      return res.redirect('/admin'); // Redirect to login page if token is missing
  }

  jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
          return res.redirect('/admin'); // Redirect to login page if token is invalid
      }
      
      if (decoded.username === adminCredentials.username) {
          res.sendFile(__dirname + '/admin-dashboard.html'); // Serve the admin dashboard HTML
      } else {
          return res.redirect('/admin'); // Redirect to login page if not the admin
      }
  });
});



app.get('/download/:userId', (req, res) => {
  const userId = req.params.userId;
  
  
  db.query('SELECT paymentImage FROM form_data WHERE id = ?', userId, (selectErr, results) => {
    if (selectErr) {
      console.error(selectErr);
      req.flash('error', 'Internal server error');
      res.redirect('/admin/dashboard'); // Redirect to the admin page or appropriate page
    } else if (results.length === 0) {
      req.flash('error', 'User not found');
      res.redirect('/admin/dashboard'); // Redirect to the admin page or appropriate page
    } else {
      const imageFilename = results[0].paymentImage;
      // Define the path to the directory where user images are stored
      const imagePath = path.join(__dirname, 'uploads', imageFilename);
      
      // Check if the file exists
      if (fs.existsSync(imagePath)) {
        // Set the appropriate headers to indicate the file download
        res.setHeader('Content-disposition', 'attachment; filename=' + imageFilename);
        res.setHeader('Content-type', 'image/png'); // You can set the appropriate content type
        
        // Stream the file to the response
        const fileStream = fs.createReadStream(imagePath);
        fileStream.pipe(res);
      } else {
        req.flash('error', 'File not found');
        res.redirect('/admin/dashboard'); // Redirect to the admin page or appropriate page
      }
    }
  });
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
