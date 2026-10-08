import { FeedbackChannels } from '../enums'

export interface FeedbackPayload {
  channel: FeedbackChannels
  name: string
  phone: string
  category?: string
  comment?: string
  model?: string
  mark?: string
  wheelDiameter?: string
  goods_id?: number
}
