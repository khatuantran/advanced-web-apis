import "dotenv/config";
import { Sequelize } from "sequelize-typescript";
import { Group } from "./group.model";
import { UserGroup } from "./user-group.model";
import { User } from "./user.model";
export const configSequelize = () => {
  const env = process.env.ENV;
  if (env === "local") {
    return new Sequelize({
      host: "localhost",
      database: "advanced-web-app",
      dialect: "postgres",
      username: "postgres",
      password: process.env.LOCAL_DATABASE_PASSWORD,
      models: [User, Group, UserGroup],
    });
  } else {
    console.log("object");
    return new Sequelize({
      host: process.env.HOST,
      port: 5432,
      database: process.env.DATABASE_NAME,
      dialect: "postgres",
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      models: [User, Group, UserGroup],
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  }
};
