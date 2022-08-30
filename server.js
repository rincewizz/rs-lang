const express = require('express');
const app = express();
const fallback = require("express-history-api-fallback");

const root = `${__dirname}/dist`;
app.use(express.static(root));

// history fallback
app.use(fallback('index.html', { root }));

let port = process.env.PORT || 80;
app.listen(port, () => console.log(`server is listening on port ${port}`));