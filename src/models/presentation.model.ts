import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
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

  public slides: Slide[];
}
