import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Chat } from "./chat.model";
import { Question } from "./question.model";
import { Slide } from "./slide.model";
import { User } from "./user.model";

@Table({
  tableName: "presentation",
  timestamps: false,
})
export class Presentation extends Model<Presentation> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  public id: string;

  @Column
  public name: string;

  @Column
  @ForeignKey(() => User)
  public ownerId: string;
  @BelongsTo(() => User, "ownerId")
  public owner: User;

  @Column
  public isPresent: boolean;

  @Column
  public status: string;

  @Column(DataType.DATE)
  public createdAt: Date;

  @Column(DataType.DATE)
  public updatedAt: Date;

  public slides: Slide[];

  public chats: Chat[];

  public questions: Question[];
}
