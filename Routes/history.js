const express = require("express");
const pool = require("../Database/database");

const route = express.Router();

route.get("/history", async (req, res) => {
  const reqId = req.body.userID;   // or req.params / req.query based on your design

  if (!reqId) {
    return res.status(400).json({
      message: "Valid Req ID is required",
    });
  }

  try {
    const resultHistory = await pool.query(
      "SELECT history FROM URLs WHERE userID = $1",
      [reqId]
    );

    if (resultHistory.rows.length === 0) {
      return res.status(404).json({
        message: "There is no URL saved with this Req ID",
      });
    }

    return res.status(200).json({
      message: "History fetched successfully",
      data: resultHistory.rows,
    });
  } catch (e) {
    console.log("Failed:", e.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = route;