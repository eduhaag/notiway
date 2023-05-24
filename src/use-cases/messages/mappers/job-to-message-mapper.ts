import { JobAttributes } from '@/providers/queues-provider'

export function jobToMessageMapper(attrs: JobAttributes) {
  return {
    schedule_id: attrs.id,
    send_on: attrs.nextRunAt,
    to: attrs.data.to,
    content: attrs.data.content,
  }
}
