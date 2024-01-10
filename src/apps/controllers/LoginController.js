import * as Yup from "yup";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

class LoginController {
  async create(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    const { email, password } = request.body; 

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const user = await User.findOne({ where: { email }});

    if (user) {
      if (password && await (bcrypt.compare(password, user.password_hash))) {
        return response.status(200).json({
          email: user.email,
          access: {
            token: jwt.sign({ id: user.id }, "y8rbmhfeyvgkywpc1uqrwh4p57hxmls4", {
              expiresIn: "7d",
            })
          },
        })
      }

      return response.status(401).json({ error: "Password wrong"});
    }

    return response.status(404).json({ error: "This email don't sing up"});
  }
}

export default new LoginController();