import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Group } from "./group.model";
import { User } from "./user.model";

export const enum GroupRole {
  OWNER = "owner",
  CO_OWNER = "co_owner",
  MEMBER = "member",
  KICK_OUT = "kick_out",
}

@Table({
  tableName: "user_group",
  timestamps: false,
})
export class UserGroup extends Model<UserGroup> {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  public userId: string;
  @BelongsTo(() => User)
  public user: User;

  @PrimaryKey
  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID })
  public groupId: string;
  @BelongsTo(() => Group)
  public group: Group;

  @Column
  public role: GroupRole;
}
