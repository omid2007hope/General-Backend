// importing individual service

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
    } catch (error) {
      return res.status(500).json({ error: JSON.stringify(error) });
    }
  }

  async getAllIndividual(req, res) {
    try {
      const individualData = await individualService.findAll({});

      if (!individualData || !individualData.length) {
        return res.status(204).json({
          message: "No error to exist",
        });
      }

      return res.status(200).json({
        data: individualData,
      });

      //
    } catch (error) {
      return res.status(500).json({ error: JSON.stringify(error) });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const individualData = await individualService.findOneByCondition({
        _id: id,
      });

      if (!individualData) {
        return res.status(204).json({
          message: "No error to exist",
        });
      }

      return res.status(200).json({
        data: individualData,
      });

      //
    } catch (error) {
      return res.status(500).json({ error: JSON.stringify(error) });
    }
  }
}

module.exports = new Individual();
