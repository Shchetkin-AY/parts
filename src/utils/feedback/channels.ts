export enum FeedbackChannels {
  phone = 'phone',
  sms = 'sms',
  max = 'max',
  telegram = 'telegram'
}

export const ChannelsLabels = {
  [FeedbackChannels.phone]: 'Телефон',
  [FeedbackChannels.sms]: 'SMS',
  [FeedbackChannels.max]: 'MAX',
  [FeedbackChannels.telegram]: 'Telegram'
}
