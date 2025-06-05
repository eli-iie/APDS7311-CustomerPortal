const express = require("express");
const app = express();

app.use(express.json());

// Test basic route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

app.listen(5001, () => {
  console.log('Test server running on port 5001');
});