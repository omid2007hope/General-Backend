class Individual {
  createIndiviual(req, res) {
    try {
      const {} = req.body;
    } catch (error) {
      return res.status(500).json({ error: JSON.stringify(error) });
    }
  }
}
module.exports = new Individual();
