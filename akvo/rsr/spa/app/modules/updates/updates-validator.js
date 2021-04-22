import * as Yup from 'yup'

export default Yup.object().shape({
  title: Yup.string()
    .required()
    .label('Title'),
  videoCaption: Yup.string(),
  videoCredit: Yup.string(),
  video: Yup.string().required(),
  photos: Yup.array()
    .of(
      Yup.object().shape({
        caption: Yup.string(),
        credit: Yup.string(),
        photo: Yup.string()
          .label('Photo')
          .when(['caption', 'credit'], {
            is: (caption, credit) => {
              return (credit?.length > 0 && credit?.length > 0)
            },
            then: Yup.string().required('Please browse a photo')
          })
      })
    )
})
