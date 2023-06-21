/* eslint-disable no-unused-vars */
const INTERVAL_MIN = 45 * 1000; // 45 seconds
const INTERVAL_MAX = 120 * 1000; // 120 seconds

function getRandomInterval() {
  return (
    Math.floor(Math.random() * (INTERVAL_MAX - INTERVAL_MIN + 1)) + INTERVAL_MIN
  );
}

const errorHandler = (err, _, res, __) => {
  if (err.status === 404) {
    res.status(err.status).send("Page not found.");
  } else {
    console.error(err);
    res.status(500).send(`Internal server error.</br>${err?.message || ""}`);
  }
};

module.exports = { getRandomInterval, errorHandler };
