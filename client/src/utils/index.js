const formatData = data => {
  return data < 10 ? `0${data}` : data
}

const parseTime = timestamp => {
  const date = new Date(Number(timestamp))
  return `${date.getFullYear()}/${formatData(date.getMonth() + 1)}/${formatData(date.getDate())} ${formatData(
    date.getHours(),
  )}:${formatData(date.getMinutes())}:${formatData(date.getSeconds())}`
}

const parseDate = timestamp => {
  const date = new Date(Number(timestamp))
  return `${date.getFullYear()}/${formatData(date.getMonth() + 1)}/${formatData(date.getDate())}`
}

module.exports = {
  parseTime,
  parseDate,
}
