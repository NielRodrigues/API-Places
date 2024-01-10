import Sequelize, { Model } from "sequelize";
import config from "../../config/database";

const sequelize = new Sequelize(config);

class Place extends Model {};

Place.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
  },
  {
    sequelize,
  }
);



export default Place;