import { FeedbackChannels } from '../enums'

export { FeedbackChannels }

export const ChannelsLabels = {
  [FeedbackChannels.phone]: 'Телефон',
  [FeedbackChannels.sms]: 'SMS',
  [FeedbackChannels.max]: 'MAX',
  [FeedbackChannels.telegram]: 'Telegram'
}
