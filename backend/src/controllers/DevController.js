const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();
    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(
        `http://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });
    }
    return res.json(dev);
  },

  async update(req, res) {
    const { bio, avatar_url, techs, name } = req.body;
    const id = req.params._id;
    const techsArray = parseStringAsArray(techs);
    const dev = await Dev.findByIdAndUpdate(id, {
      $set: { bio, avatar_url, name, techs: techsArray }
    });
    return res.json(dev);
  },

  async destroy(req, res) {}
};
