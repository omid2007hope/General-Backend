const individualService = require("../Service/Individual");
class Individual {
  async createIndiviual(req, res) {
    try {
      const { firstName, lastName, jobTitle, description, skillTags } =
        req.body;

      const object = {
        firstName: firstName,
        lastName: lastName,
        jobTitle: jobTitle,
        description: description,
        skillTags: skillTags,
      };

      const createObject = await individualService.createObject(object);

      if (!createObject) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }

      return res.status(201).json({
        data: createObject,
      });

      console.log(createObject);
    } catch (error) {
      return res.status(500).json({ error: JSON.stringify(error) });
    }
  }
}
module.exports = new Individual();
