import * as Yup from 'yup'

export default Yup.object().shape({
  title: Yup.string()
    .trim()
    .required()
    .label('Title'),
  videoCaption: Yup.string(),
  videoCredit: Yup.string(),
  video: Yup.string()
    .trim()
    .when(['videoCaption', 'videoCredit'], {
      is: (videoCaption, videoCredit) => {
        return (videoCaption?.length > 0 || videoCredit?.length > 0)
      },
      then: Yup.string().required('Please provide a Video URL')
    }),
  photoCaption: Yup.string(),
  photoCredit: Yup.string(),
  photo: Yup.string()
    .nullable(true)
    .when(['photoCaption', 'photoCredit'], {
      is: (photoCaption, photoCredit) => {
        return photoCaption?.length > 0 || photoCredit?.length > 0
      },
      then: Yup.string().required('Please browse a photo')
    }),
  photos: Yup.array()
    .of(
      Yup.object().shape({
        caption: Yup.string(),
        credit: Yup.string(),
        photo: Yup.string()
          .nullable(true)
          .label('Photo')
          .when(['caption', 'credit'], {
            is: (caption, credit) => {
              return (caption?.length > 0 || credit?.length > 0)
            },
            then: Yup.string().required('Please browse a photo')
          })
      })
    )
})
