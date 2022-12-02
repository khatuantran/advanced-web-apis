import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Presentation } from "./presentation.model";

export type ISlideOption = {
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
}
