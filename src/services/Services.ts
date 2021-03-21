import axios from "axios";
import {
  BaseType,
  IDeposit,
  IProfile,
  ISavings,
  IUser,
  IResponse,
} from "./Type";

class Service {
  BASE_URL = /*"https://trianapp.herokuapp.com";*/ "http://localhost:3000";
  KEY_USER = "zzaAbB";
  KEY_SAVING = "sSaAvViInNgG";

  get(path: string): Promise<IResponse> {
    return new Promise((resolve) => {
      axios
        .get(`${this.BASE_URL}${path}`)
        .then((response) => {
          if (
            response.data.statusCode == 200 ||
            response.data.statusCode == 201
          ) {
            resolve({
              success: true,
              data: { success: true, data: response.data.data },
              message: response.data.message,
            });
          } else {
            resolve({
              success: false,
              data: { success: false, data: [] },
              message: response.data.message,
            });
          }
        })
        .catch((error) => {
          resolve({
            success: false,
            data: { success: false, data: [] },
            message: `${error}`,
          });
        });
    });
  }
  post(path: string, param: any): Promise<IResponse> {
    return new Promise((resolve) => {
      axios
        .post(`${this.BASE_URL}${path}`, param, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (
            response.data.statusCode == 200 ||
            response.data.statusCode == 201
          ) {
            resolve({
              success: true,
              data: { success: true, data: response.data.data },
              message: response.data.message,
            });
          } else {
            resolve({
              success: false,
              data: { success: false, data: [] },
              message: response.data.message,
            });
          }
        })
        .catch((error) => {
          resolve({
            success: false,
            data: { success: false, data: [] },
            message: `${error}`,
          });
        });
    });
  }

  /**
   *
   * @param body
   * @returns
   */
  login(body: any): Promise<BaseType<IUser>> {
    return new Promise((resolve) => {
      this.post("/user/login", body).then((result: IResponse) => {
        if (result.success) {
          const data: BaseType<IUser> = result.data;
          this.saveUser(data.data[0]);
          resolve({ success: true, data: data.data });
        } else {
          resolve({ success: false, data: [] });
        }
      });
    });
  }
  /**
   *
   * @param body
   * @returns
   */
  register(body: any): Promise<BaseType<IUser>> {
    return new Promise((resolve) => {
      this.post("/user/register", body).then((result: IResponse) => {
        if (result.success) {
          const data: BaseType<IUser> = result.data;

          this.saveUser(data.data[0]);
          resolve({ success: true, data: data.data });
        } else {
          resolve(result);
        }
      });
    });
  }
  /**
   *
   * @param path
   * @returns
   */
  getProfil(path: string): Promise<BaseType<IProfile>> {
    return new Promise((resolve) => {
      this.get(path).then((result: IResponse) => {
        if (result.success) {
          const data: BaseType<IProfile> = result.data;
          if (data.data[0].saving)
            this.saveSaving(data.data[0].saving.savingId);
          resolve({ success: true, data: data.data });
        } else {
          resolve({ success: false, data: [] });
        }
      });
    });
  }

  /**
   *
   * @param path
   * @returns
   */
  getMySaving(path: string): Promise<BaseType<ISavings>> {
    return new Promise((resolve) => {
      this.get(path).then((result: IResponse) => {
        if (result.success) {
          const data: BaseType<ISavings> = result.data;
          resolve({ success: true, data: data.data });
        } else {
          resolve({ success: false, data: [] });
        }
      });
    });
  }
  /**
   *
   * @param path
   * @param body
   * @returns
   */
  createSaving(path: string, body: any): Promise<BaseType<ISavings>> {
    return new Promise((resolve) => {
      this.post(path, body).then((result: IResponse) => {
        if (result.success) {
          const data: BaseType<ISavings> = result.data;
          resolve({ success: true, data: data.data });
        } else {
          resolve({ success: false, data: [] });
        }
      });
    });
  }
  /**
   *
   * @param path
   * @returns
   */
  getMyDeposit(path: string): Promise<BaseType<IDeposit>> {
    return new Promise((resolve) => {
      this.get(path).then((result: IResponse) => {
        if (result.success) {
          const data: BaseType<IDeposit> = result.data;
          resolve({ success: true, data: data.data });
        } else {
          resolve({ success: false, data: [] });
        }
      });
    });
  }
  /**
   *
   * @param path
   * @returns
   */
  getDepositById(path: string): Promise<BaseType<IDeposit>> {
    return new Promise((resolve) => {
      this.get(path).then((result: IResponse) => {
        if (result.success) {
          const data: BaseType<IDeposit> = result.data;
          resolve({ success: true, data: data.data });
        } else {
          resolve({ success: false, data: [] });
        }
      });
    });
  }
  /**
   *
   * @param path
   * @param body
   * @returns
   */
  createDeposit(path: string, body: any): Promise<BaseType<IDeposit>> {
    return new Promise((resolve) => {
      this.post(path, body).then((result: IResponse) => {
        if (result.success) {
          const data: BaseType<IDeposit> = result.data;
          resolve({ success: true, data: data.data });
        } else {
          resolve({ success: false, data: [] });
        }
      });
    });
  }
  confirmationDeposit(path: string, body: any): Promise<BaseType<IDeposit>> {
    return new Promise(() => {});
  }
  /**
   *
   * @param data
   */

  saveUser(data: any) {
    window.sessionStorage.setItem(this.KEY_USER, JSON.stringify(data));
  }
  getUser() {
    const data: any =
      window.sessionStorage.getItem(this.KEY_USER) == null
        ? "{}"
        : window.sessionStorage.getItem(this.KEY_USER);
    return JSON.parse(data);
  }
  saveSaving(saving: any) {
    window.sessionStorage.setItem(this.KEY_SAVING, JSON.stringify(saving));
  }
  getSaving() {
    const data: any =
      window.sessionStorage.getItem(this.KEY_SAVING) == null
        ? "{}"
        : window.sessionStorage.getItem(this.KEY_SAVING);
    return JSON.parse(data);
  }
}
export default new Service();
