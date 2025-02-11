class DateUtil {
  static firstDateThisMonth(date: Date) {
    const dateThisMonth = new Date(date.getTime());
    dateThisMonth.setDate(1);
    dateThisMonth.setMonth(dateThisMonth.getMonth());
    return dateThisMonth;
  }

  static firstDatePrevMonth(date: Date) {
    const datePrevMonth = new Date(date.getTime());
    datePrevMonth.setDate(1);
    datePrevMonth.setMonth(datePrevMonth.getMonth() - 1);
    return datePrevMonth;
  }

  static firstDateNextMonth(date: Date) {
    const dateNextMonth = new Date(date.getTime());
    dateNextMonth.setDate(1);
    dateNextMonth.setMonth(dateNextMonth.getMonth() + 1);
    return dateNextMonth;
  }
}

export default DateUtil;