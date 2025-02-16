class DateUtil {
  static getFirstDate(date: Date, addMonth: number) {
    const targetDate = new Date(date.getTime());
    targetDate.setDate(1);
    targetDate.setMonth(targetDate.getMonth() + addMonth);
    return targetDate;
  }
}

export default DateUtil;