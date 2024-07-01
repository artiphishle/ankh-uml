import {IdManager} from './IdManager';
import {WebsiteVerifier} from './WebsiteVerifier';
import {Address,type IAddress  } from './Address';

interface IUser {
  id?: string;
  address: IAddress;
  username: string;
  email: string;
  website: string;
}

export class User {
  private id: string;
  private email: string;
  private username: string;
  private address: IAddress;
  private website: string;
  private websiteVerifier: WebsiteVerifier;

  constructor({username, email, website}: IUser) {
    this.websiteVerifier = new WebsiteVerifier();
    this.id = IdManager.generateId();
    this.username = username;
    this.address = new Address({
      address: "Mainstreet 1",
      zip: "8000"
    }).getAddress();

    if (!this.verifyEmail(email)) throw new Error('Invalid eMail');
    this.email = email;

    if (this.websiteVerifier.verify(website))
      throw new Error('Invalid website');
    this.website = website;
  }

  public getUser() {
    return `
      id: ${this.id}\n
      username: ${this.username}\n
      email: ${this.email}\n
      website: ${this.website}
    `;
  }

  private verifyEmail(email: string): boolean {
    return email.includes('@');
  }
}
