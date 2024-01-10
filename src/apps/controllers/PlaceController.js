import * as Yup from "yup";
import Place from "../models/Place";
import { Op } from "sequelize";

class PlaceController {
  async index(request, response) {
    const { name, city, state } = request.query;

    let where = {};

    if (name) {
      where = {
        ...where,
        name: { [Op.substring]: name }
      };
    }

    if (city) {
      where = {
        ...where,
        city: { [Op.substring]: city }
      };
    }

    if (state) {
      where = {
        ...where,
        state: { [Op.substring]: state }
      };
    }

    const page = request.query.page || 1;
    const limit = request.query.limit || 20;

    const places = await Place.findAll({ 
      order: ["id"],
      where,
      limit,
      offset: limit * page - limit,
    });

    return response.status(200).json(places);
  }

  async show(request, response) {
    const { id } = request.params;

    const place = await Place.findByPk(id);

    if (!place) {
      return response.status(404).json({ error: "Place not found." });
    }

    return response.status(200).json(place);
  }

  async create(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const place = await Place.create(request.body);

    return response.status(201).json(place);
  }

  async update(request, response) {
    const { id } = request.params;

    const place = await Place.findByPk(id);

    if (!place) {
      return response.status(404).json({ error: "Place not found." });
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    await Place.update(request.body, {
      where: { id },
    });

    return response.status(200).json({ message: "This place has been updated." });
  }

  async delete(request, response) {
    const { id } = request.params;

    const place = await Place.findByPk(id);

    if (!place) {
      return response.status(404).json({ error: "Place not found." });
    }

    await Place.destroy({ where: { id } });

    return response.status(200).json({ message: "This place has been deleted." });
  }
}

export default new PlaceController();