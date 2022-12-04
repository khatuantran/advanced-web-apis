import { Group, Presentation, Slide, User, UserGroup } from "../models";
export const configAssociation = () => {
  User.hasMany(UserGroup, { as: "groups", foreignKey: "userId" });
  User.hasMany(Presentation, { as: "presentations", foreignKey: "ownerId" });
  Group.hasMany(UserGroup, { as: "users", foreignKey: "groupId" });
  Presentation.hasMany(Slide, { as: "slides", foreignKey: "presentationId" });
};
