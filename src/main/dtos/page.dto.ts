export class PageDto<T = unknown> {
  public items: T[];
  public total: number;
  public limit: number;
  public offset: number;

  constructor(items: T[], total: number, limit: number, offset: number) {
    this.items = items;
    this.total = total;
    this.limit = limit;
    this.offset = offset;
  }
}
