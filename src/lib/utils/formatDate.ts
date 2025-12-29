export const formatDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }
  /*
  日付をY.MM.DD形式に変換
  例: 2023-10-01T12:34:56Z -> 2023.10.01
  */
  return new Date(date).toLocaleString('ja-JP', options).split(' ')[0].replace(/\//g, '.')
}
