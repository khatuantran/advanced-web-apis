import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Presentation } from "./presentation.model";
import { User } from "./user.model";

export type ISlideOption = {
  index: number;
  content: string;
  chooseNumber: number;
};
@Table({
  tableName: "slide",
  timestamps: false,
})
export class Slide extends Model<Slide> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  public id: string;

  @Column
  public title: string;

  @Column(DataType.JSONB)
  public options: ISlideOption[];

  @Column
  public type: string;

  @Column
  @ForeignKey(() => Presentation)
  public presentationId: string;
  @BelongsTo(() => Presentation, "presentationId")
  public presentation: Presentation;

  @Column
  public isSelected: boolean;

  @Column
  public order: number;

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
