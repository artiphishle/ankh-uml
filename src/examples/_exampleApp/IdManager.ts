export type UniqueIdentifier = string;

export abstract class IdManager {
  private static id = 0;

  public static generateId(): UniqueIdentifier {
    return `id-${this.id++}`;
  }
}
