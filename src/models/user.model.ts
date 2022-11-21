import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
@Table({
  tableName: "user",
  timestamps: false,
})
export class User extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column
  fullName: string;

  @Column
  username: string;

  @Column
  password: string;

  @Column
  email: string;

  @Column
  tokenCounter: number;
}
