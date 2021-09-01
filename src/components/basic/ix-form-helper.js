
import React from 'react'
import FormHelperText from '@material-ui/core/FormHelperText'

const IxFromHelper = ({ touched, touchedOnLoad, error }) => {
  if (!((touchedOnLoad || touched) && error)) {
    return
  } else {
    return <FormHelperText>{(touchedOnLoad || touched) && error}</FormHelperText>
  }
}

export default IxFromHelper
