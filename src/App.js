import Header from "./components/Header/Header";
import "./app.scss";
import Footer from "./components/Footer/Footer";
import AccContainer from "./components/AccContainer/AccContainer";
import CTA from "./components/CTA/CTA";
import Cities from "./components/Cities/Cities";
import Collection from "./components/Collections/Collection";
import Card from "./components/Card/Card";

function App() {
  return (
    <div className="App">
      <Header />
      <Card />
      <Collection />
      <Cities />
      <CTA />
      <AccContainer />
      <Footer />
    </div>
  );
}

export default App;

const express = require('express');
const client = require('prom-client');

const app = express();

// Register default metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Define a custom counter metric
const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Middleware to count requests
app.use((req, res, next) => {
  res.on('finish', () => {
    requestCounter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Your existing routes here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
