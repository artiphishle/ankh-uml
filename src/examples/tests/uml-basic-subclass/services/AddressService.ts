export abstract class AddressService {
  private static zipCityMap: Map<string, string> = new Map([
    ["8000","Zurich"]
  ]);
  
  public static getCityByZip(zip: string){
    const city = this.zipCityMap.get(zip);
    
    return city || "{unknown}";
  }
}