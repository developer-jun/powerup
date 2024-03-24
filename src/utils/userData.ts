//type UserType = "admin" | "regular";

interface UserInfoStruct {
  username: string,
  id: number,
  userType: string
  //userType: UserType
}

export class UserInfo implements UserInfoStruct {
  id: number;
  username: string;
  userType: string
  //userType: UserType;

  constructor(id: number, username: string, userType: string) {
    this.id = id;
    this.username = username;
    this.userType = userType;
    // this.userType = this.convertUserType(userType);
  }

  /*
  private convertUserType(value: string): UserType {
    if (value === "admin" || value === "regular") {
      return value as UserType;
    }
    throw new Error("Invalid userType value.");
  }
  */
}