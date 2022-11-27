// import "dotenv/config";
// import express from "express";
// import { StatusCodes } from "http-status-codes";
// import { Op } from "sequelize";
// import { Group, UserGroup } from "../../models";
// // import 'express-async-errors';
// export const listPublicGroup = async (req: express.Request, res: express.Response) => {
//   try {
//     const userJoinedGroup = (
//       await UserGroup.findAll({
//         where: {
//           userId: req.user.id,
//         },
//       })
//     ).map((userGroup) => userGroup.groupId);
//     console.log(userJoinedGroup);
//     const groups = (
//       await Group.findAll({
//         where: {
//           id: {
//             [Op.notIn]: userJoinedGroup,
//           },
//         },
//         include: [
//           {
//             model: UserGroup,
//             as: "user",
//           },
//         ],
//       })
//     ).map((group) => {
//       return {
//         groupId: group.id,
//         groupName: userGroup.group.name,
//         role: userGroup.role,
//       };
//     });
//     return res.status(StatusCodes.OK).json({
//       code: StatusCodes.OK,
//       data: {
//         groups: groups,
//       },
//     });
//   } catch (err) {
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       status: StatusCodes.BAD_REQUEST,
//       error: {
//         message: err.message,
//       },
//     });
//   }
// };
