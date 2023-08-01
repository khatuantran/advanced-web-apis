import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Presentation } from "./presentation.model";
import { UserGroup } from "./user-group.model";
import { User } from "./user.model";

@Table({
  tableName: "group",
  timestamps: false,
})
export class Group extends Model<Group> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  public id: string;

  @Column
  public name: string;

  @Column
  public isPublic: boolean;

  @ForeignKey(() => User)
  @Column
  public ownerId: string;
  @BelongsTo(() => User, "ownerId")
  public owner: User;

  @Column
  public invitationLink: string;

  @Column
  public status: string;

  @ForeignKey(() => Presentation)
  @Column
  public presentationId: string;
  @BelongsTo(() => Presentation, "presentationId")
  public presentation: Presentation;

  public users: UserGroup[];
}
