import * as Yup from "yup";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";

const verifyAsync = promisify(jwt.verify);

class UserController {
  // Consultar todos os usuários
  async index(request, response) {
    const page = request.query.page || 1;
    const limit = request.query.limit || 20;

    const user = await User.findAll({
      attributes: { exclude: ["password_hash", "createdAt", "updatedAt", "token"] },
      order: ["id"],
      limit,
      offset: limit * page - limit,
    });

    return response.status(200).json(user);
  }

  // Mostrar um usuário em específico, junto com as suas consultas marcadas
  async show(request, response) {
    const { id } = request.params
    const authHeader = request.headers.authorization;

    try {
      const decoded = await verifyAsync(authHeader, "y8rbmhfeyvgkywpc1uqrwh4p57hxmls4")

      if (!id || !decoded || decoded.id != id) {
        return response.status(401).json({ error: "This token cannot access this user's route" })
      }
    } catch {
      return response.status(401).json({ error: "This token cannot access this user's route" })
    }
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password_hash", "createdAt", "updatedAt", "token"] },
    });

    if (!user) {
      return response.status(404).json({ error: "User not found "});
    }

    return response.status(200).json(user);
  }

  // Criar um novo usuário
  async create(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(8).required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const { email } = request.body;
    const findUser = await User.findOne({ where: { email }});

    if (findUser) {
      return response.status(400).json({ error: "This email already has been sign up" });
    }

    const { id, name } = await User.create(request.body);

    return response.status(201).json({ id, name, email });
  }

  // Atualizar dados do usuário
  async update(request, response) {
    const { id } = request.params;
    const authHeader = request.headers.authorization;

    try {
      const decoded = await verifyAsync(authHeader, "y8rbmhfeyvgkywpc1uqrwh4p57hxmls4")

      if (!id || !decoded || decoded.id != id) {
        return response.status(401).json({ error: "This token cannot access this user's route" })
      }
    } catch {
      return response.status(401).json({ error: "This token cannot access this user's route" })
    }

    const user = await User.findByPk(id);

    if (!user) {
      return response.status(404).json({ error: "User not found "});
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string().min(8),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const { password, email } = request.body;
    const fields = { ...request.body };

    if (email) {
      const findUser = await User.findOne({ where: { email }});

      if (findUser) {
        return response.status(400).json({ error: "This email already has been sign up" });
      }
    }

    if (password) {
      fields.password_hash = await bcrypt.hash(password, 8);
    }

    await User.update(fields, {
      where: {
        id,
      },
    });

    return response.status(200).json({ message: "This user has been updated" });
  }

  // Deletar um usuário
  async delete(request, response) {
    const { id } = request.params;
    const authHeader = request.headers.authorization;

    try {
      const decoded = await verifyAsync(authHeader, "y8rbmhfeyvgkywpc1uqrwh4p57hxmls4")

      if (!id || !decoded || decoded.id != id) {
        return response.status(401).json({ error: "This token cannot access this user's route" })
      }
    } catch {
      return response.status(401).json({ error: "This token cannot access this user's route" })
    }

    const user = await User.findByPk(id);

    if (!user) {
      return response.status(404).json({ error: "User not found "});
    }

    await User.destroy({ where: { id } });

    return response.status(200).json({ message: "This user has been deleted" });
  }
}

export default new UserController();