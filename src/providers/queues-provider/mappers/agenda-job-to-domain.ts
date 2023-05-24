import { JobAttributes } from 'agenda'

export function agendaJobToDomain(attrs: JobAttributes) {
  const {
    _id,
    name,
    data,
    priority,
    shouldSaveResult,
    type,
    nextRunAt,
    lastModifiedBy,
    lastRunAt,
    failCount,
    failReason,
    failedAt,
    lastFinishedAt,
  } = attrs

  return {
    id: _id.toString(),
    name,
    data,
    priority,
    shouldSaveResult,
    type,
    nextRunAt,
    lastModifiedBy,
    lastRunAt,
    failCount,
    failReason,
    failedAt,
    lastFinishedAt,
  }
}
