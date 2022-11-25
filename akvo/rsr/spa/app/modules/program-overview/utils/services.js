import api from '../../../utils/api'

export const getAllActualValues = (programID, ids, callback) => {
  api
    .get(`/program/${programID}/indicator_period_by_ids/?format=json&ids=${ids}`)
    .then(({ data }) => callback(data))
    .catch((err) => console.error(err))
}
