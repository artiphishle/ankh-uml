import {IdManager, type UniqueIdentifier} from './IdManager';
import {WebsiteVerifier} from './WebsiteVerifier';

interface IUser {
  id?: string;
  username: string;
  email: string;
  website: string;
}

class User {
  private id: string;
  private email: string;
  private username: string;
  private website: string;

  constructor({username, email, website}: IUser) {
    this.id = IdManager.generateId();
    this.username = username;

    if (!this.verifyEmail(email)) throw new Error('Invalid eMail');
    this.email = email;

    if (!WebsiteVerifier.verify(website)) throw new Error('Invalid website');
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
