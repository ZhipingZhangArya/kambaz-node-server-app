export default function PathParameters(app) {
  const add = (req, res) => {
    const { a, b } = req.params;
    const sum = parseInt(a, 10) + parseInt(b, 10);
    res.send(sum.toString());
  };

  const subtract = (req, res) => {
    const { a, b } = req.params;
    const difference = parseInt(a, 10) - parseInt(b, 10);
    res.send(difference.toString());
  };

  const multiply = (req, res) => {
    const { a, b } = req.params;
    const product = parseInt(a, 10) * parseInt(b, 10);
    res.send(product.toString());
  };

  const divide = (req, res) => {
    const { a, b } = req.params;
    const divisor = parseInt(b, 10);
    if (divisor === 0) {
      res.status(400).send('Division by zero is not allowed');
      return;
    }
    const quotient = parseInt(a, 10) / divisor;
    res.send(quotient.toString());
  };

  app.get('/lab5/add/:a/:b', add);
  app.get('/lab5/subtract/:a/:b', subtract);
  app.get('/lab5/multiply/:a/:b', multiply);
  app.get('/lab5/divide/:a/:b', divide);
}
