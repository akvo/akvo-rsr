import clockHistory from '../images/clock-history.svg'
import editPencil from '../images/edit-pencil.svg'
import editButton from '../images/edit-button.svg'
import statusPending from '../images/status-pending.svg'
import statusApproved from '../images/status-approved.svg'
import statusRevision from '../images/status-revision.svg'

export const icons = {
  clock: {
    history: clockHistory
  },
  edit: {
    pencil: editPencil,
    button: editButton
  },
  status: {
    pending: statusPending,
    approved: statusApproved,
    'returned-for-revision': statusRevision,
  },
}
