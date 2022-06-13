const express = require("express");

// Parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", (req,res) => {
    res.send("<h1>Test</h1>")
})

module.exports = app;
