import {AddressService} from "./services/AddressService";

export interface IAddress {
  address: string;
  zip: string;
  city?: string;
}

export class Address {
  private address: IAddress;
  
  constructor({address, zip}: IAddress){
    const city = AddressService.getCityByZip(zip);
    
    this.address = { address, zip, city };
  }
  
  public getAddress() : IAddress {
    return this.address;
  }
}