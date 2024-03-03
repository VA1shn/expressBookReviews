const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { isValid, authenticatedUser, users } = require('./router/auth_users.js');
const { public_users, customer_routes } = require('./router/general.js');

//const { isValid, authenticatedUser, users } = require('./router/auth_users.js');

const app = express();

app.use(session({ secret: "your-secret-key", resave: true, saveUninitialized: true }));

app.use(express.json());

//app.use("/customer", general);
app.use("/", public_users);
app.use("/customer", customer_routes);
//app.use("/customer", general.customer_routes);

//app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    const accessToken = req.session.authorization?.accessToken;
    const username = req.session.authorization?.username;

    if (!accessToken || !username) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // Verify the JWT token
    jwt.verify(accessToken, 'access', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token. Please log in." });
        }

        // Check if the decoded data matches the stored username (optional)
        if (decoded.data !== username) {
            return res.status(401).json({ message: "Invalid token. Please log in." });
        }

        // Authentication successful, proceed to the next middleware or route
        next();
    });
});
app.put("/customer/auth/review/:isbn", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const review = req.query.review;

    // Check if the user is logged in
    if (!username) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // Check if the required parameters are provided
    if (!isbn || !review) {
        return res.status(400).json({ message: "ISBN and review are required." });
    }

    // Find the user in the users array
    const user = users.find((user) => user.username === username);

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    // Check if the review for the ISBN already exists
    const existingReviewIndex = user.reviews.findIndex((r) => r.isbn === isbn);

    if (existingReviewIndex !== -1) {
        // Modify the existing review
        user.reviews[existingReviewIndex].review = review;
        return res.status(200).json({ message: "Review modified successfully." });
    } else {
        // Add a new review
        user.reviews.push({ isbn, review });
        return res.status(201).json({ message: "Review added successfully." });
    }
});


const PORT = 5001;



app.post("/customer/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
   
    
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

app.listen(PORT, () => console.log("Server is running"));
