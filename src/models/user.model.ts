import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
export const enum UserStatus {
  ACTIVE = "active",
  IN_ACTIVE = "inactive",
}
export const enum UserProvider {
  MANUAL = "manual",
  GOOGLE = "google",
}

@Table({
  tableName: "user",
  timestamps: false,
})
export class User extends Model<User> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  public id: string;

  @Column
  public fullName: string;

  @Column
  public password: string;

  @Column
  public email: string;

  @Column
  public tokenCounter: number;

  @Column
  public status: UserStatus;

  @Column
  public provider: UserProvider;

  @Column
  public activateString: string;

  // @HasMany(() => UserGroup)
  // public groups: UserGroup[];
}
