export class PaginationProcesser {
  constructor(private page: number, private perPage: number) {}

  calculateSkipAndLimit = () => {
    const numberOfSkipItems = (this.page - 1) * this.perPage;
    const numberOfLimit = this.perPage;
    return {
      numberOfSkipItems,
      numberOfLimit,
    };
  };

  isPageNumberValid = (count: number) => {
    if (!count && this.page !== 1) return false;
    return true;
  };

  response = (count: number, data: unknown[]) => {
    const lastPage = Math.ceil(count / this.perPage);
    return {
      count,
      perPage: this.perPage,
      prevPage: this.page - 1 <= 0 ? null : this.page - 1,
      currentPage: this.page,
      nextPage: this.page === lastPage ? null : this.page + 1,
      lastPage,
      data,
    };
  };
}
