import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Presentation } from "./presentation.model";
import { User } from "./user.model";

@Table({
  tableName: "question",
  timestamps: false,
})
export class Question extends Model<Question> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  public id: string;

  @Column
  public content: string;

  @Column
  public voteQuantity: number;

  @Column
  public isAnswer: boolean;

  @ForeignKey(() => Presentation)
  @Column
  public presentationId: string;
  @BelongsTo(() => Presentation, "presentationId")
  public presentation: Presentation;

  @Column
  @ForeignKey(() => User)
  public createdBy: string;
  @BelongsTo(() => User, "createdBy")
  public createdUser: User;

  @Column(DataType.DATE)
  public createdAt: Date;

  @Column(DataType.DATE)
  public updatedAt: Date;

  @Column
  @ForeignKey(() => User)
  public updatedBy: string;
  @BelongsTo(() => User, "updatedBy")
  public updatedUser: User;
}
