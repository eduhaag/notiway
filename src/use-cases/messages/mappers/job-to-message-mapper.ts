import { Job } from 'agenda'

export function jobToMessageMapper({ attrs }: Job) {
  return {
    schedule_id: attrs._id.toString(),
    send_on: attrs.nextRunAt,
    to: attrs.data.to,
    content: attrs.data.content,
  }
}
