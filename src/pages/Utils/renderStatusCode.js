import moment from 'moment/moment'
import { colorStatus, colorbgStatus, orderStatus } from '../../constant/OrderStatus'

export const renderStatusCode = (statusNumber = 1) => {
  return orderStatus[statusNumber]
}

export const renderColorStatusCode = (colorStatusNumber = 1) => {
  return colorStatus[colorStatusNumber]
}

export const renderBgColorStatusCode = (colorbgStatusNumber = 1) => {
  return colorbgStatus[colorbgStatusNumber]
}

export const renderDate = (date) => {
  const momentDay = moment(date)
  return momentDay.format('DD/MM/YYYY')
}
