export default function QueryParameters(app) {
  const calculator = (req, res) => {
    const { a, b, operation } = req.query;
    const first = parseFloat(a);
    const second = parseFloat(b);

    if (Number.isNaN(first) || Number.isNaN(second)) {
      res.status(400).send('Invalid numeric parameters');
      return;
    }

    let result;

    switch (operation) {
      case 'add':
        result = first + second;
        break;
      case 'subtract':
        result = first - second;
        break;
      case 'multiply':
        result = first * second;
        break;
      case 'divide':
        if (second === 0) {
          res.status(400).send('Division by zero is not allowed');
          return;
        }
        result = first / second;
        break;
      default:
        result = 'Invalid operation';
    }

    res.send(result.toString());
  };

  app.get('/lab5/calculator', calculator);
}
