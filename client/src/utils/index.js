const formatData = data => {
  return data < 10 ? `0${data}` : data
}

const parseTime = (timestamp, isSecond = true) => {
  let date = null
  if (typeof timestamp === 'number') {
    date = new Date(timestamp * (isSecond ? 1000 : 1))
  } else if (typeof timestamp === 'string') {
    if (timestamp.startsWith('0x')) {
      date = new Date(parseInt(timestamp) * (isSecond ? 1000 : 1))
    } else {
      date = new Date(Number(timestamp) * (isSecond ? 1000 : 1))
    }
  }
  return `${date.getFullYear()}/${formatData(date.getMonth() + 1)}/${formatData(date.getDate())} ${formatData(
    date.getHours(),
  )}:${formatData(date.getMinutes())}:${formatData(date.getSeconds())}`
}

const parseDate = timestamp => {
  const date = new Date(Number(timestamp) * 1000)
  return `${formatData(date.getMonth() + 1)}/${formatData(date.getDate())} ${formatData(date.getHours())}:${formatData(date.getMinutes())}`
}

const parseUpperToken = token => {
  return `${token.toUpperCase()}/USDT`
}

module.exports = {
  parseTime,
  parseDate,
  parseUpperToken,
}
