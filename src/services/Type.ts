export interface BaseType<Types> {
  success: boolean;
  data: Array<Types>;
}
export interface IProfile {
  user: IUser;
  saving: ISavings;
  count: Array<ICount>;
}
export interface ICount {
  savingId: string;
  total: Number;
}
export interface IUser {
  _id?: string;
  uid: string;
  name: string | any;
  email: string | any;
  password: string;
  gender: string;
  createdAt?: Number;
  updatedAt?: Number;
}
export interface ISavings {
  _id?: string;
  savingId: string;
  userId: string;
  description: string;
  createdBy: string;
  createdAt?: Number;
  updatedAt?: Number;
}
export interface IDeposit {
  _id?: string;
  sender: string;
  savingId: string;
  nominal: Number;
  receipt: string;
  accepted: string;
  type: "deposit" | "spending";
  receiptname: string;
  description: string;
  createdAt?: Number;
  updatedAt?: Number;
}

export interface IFormDeposit {
  nominal: Number | string | any;
  description: string;
  receipt: any;
  receiptname: string;
  filename: string;
  tabungantype: string;
}
export interface IResponse {
  success: boolean;
  data: any;
  message?: string;
}
