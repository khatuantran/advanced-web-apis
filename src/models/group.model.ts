import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user.model";

@Table({
  tableName: "group",
  timestamps: false,
})
export class Group extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column
  name: string;

  @Column
  isPublic: boolean;

  @ForeignKey(() => User)
  @Column
  ownerId: string;
  @BelongsTo(() => User, "ownerId")
  public owner: User;

  @Column
  invitationLink: string;

  @Column
  status: string;
}
