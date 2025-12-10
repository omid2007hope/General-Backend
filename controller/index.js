const collect = (req, res) => {
  const { numberOne, numberTwo } = req.body;
  const result = numberOne + numberTwo;
  return res.status(200).json({ data: result });
};

module.exports = { collect };
