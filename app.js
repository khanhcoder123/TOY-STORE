const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const { connectToDatabase, getDatabase } = require('./db');
const session = require('express-session');
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct, searchProducts } = require('./product');

// Cấu hình static middleware cho thư mục public
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware for managing sessions
app.use(
  session({
    secret: 'your-secret-key', // Change this to a random and secure value
    resave: false,
    saveUninitialized: false,
  })
);

connectToDatabase();



app.get('/', async (req, res) => {
  const items = await getProducts();
  res.render('homepage', { products: items, user: req.session.user }); // Thêm thông tin người dùng vào context
});
app.get('/homepage', async (req, res) => {
  const items = await getProducts();
  const user = req.session.user; // Lấy thông tin người dùng đã lưu trong session

  // Truyền thông tin người dùng vào giao diện để hiển thị
  res.render('homepage', { products: items, user: user });
});

const users = []; // Temporary array to store registered users (replace this with a proper database implementation)

// Other routes and middleware (if any)

// Route for the register page (GET request)
app.get('/register', (req, res) => {
  res.render('register');
});

// Route for user registration (POST request)
// Route for user registration (POST request)
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation for name, email, and password
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    // Insert the new user data into the "users" collection in MongoDB
    const user = await getDatabase().collection('users').insertOne({ name, email, password });

    // Redirect to the login page after successful registration
    res.redirect('/login');
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});



// Route for user login (GET request)
app.get('/login', (req, res) => {
  res.render('login');
});

// Route for user login (POST request)
// Route for user login (POST request)
// Route for user login (POST request)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation for email and password
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find the user in the "users" collection based on the provided email
    const user = await getDatabase().collection('users').findOne({ email });

    // If the user is not found or the password is incorrect, respond with an error
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Save the user data in the session
    req.session.user = user;

    // If the user exists and the credentials are correct, you can redirect the user to a dashboard page
    res.redirect('/homepage'); // Replace '/dashboard' with the actual dashboard page route
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Route for user logout
app.get('/logout', (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
    }
    res.redirect('/homepage'); // Redirect back to the homepage after logout
  });
});

app.post('/add', async (req, res) => {
  const { name, price, image, description } = req.body;
  try {
    const newItem = await createProduct({ name, price: parseFloat(price), image, description });
    res.redirect('/');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);
    res.render('edit', { product });
  } catch (err) {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, image, description } = req.body;
  try {
    await updateProduct(id, { name, price: parseFloat(price), image, description });
    res.redirect('/');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ... (previous code)

app.post('/delete/:_id', async (req, res) => {
  const { _id } = req.params;
  try {
    await deleteProduct(_id);
    res.redirect('/toy-manager')
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ... (remaining code)


app.get('/toy-manager', async (req, res) => {
  const items = await getProducts();
  res.render('toy-manager', { products: items });
});

app.post('/search', async (req, res) => {
  const { query } = req.body;
  try {
    const items = await searchProducts(query);
    res.render('toy-manager', { products: items });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on :${PORT}`);
});
