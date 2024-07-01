export abstract class WebsiteVerifier {
  public static verify(website: string): boolean {
    console.log("[WebsiteVerifier::verify]", website)
    return true;
  }
}
