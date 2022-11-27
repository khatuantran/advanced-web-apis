import { Group, User, UserGroup } from "../models";
export const configAssociation = () => {
  User.hasMany(UserGroup, { as: "groups", foreignKey: "userId" });
  Group.hasMany(UserGroup, { as: "users", foreignKey: "groupId" });
};
