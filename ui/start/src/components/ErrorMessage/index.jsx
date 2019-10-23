import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

import './styles.css'

const ErrorMessage = ({ msg }) => (
  <Typography variant="h3" color="error" styleName="error">
    {msg}
  </Typography>
)

ErrorMessage.propTypes = {
  msg: PropTypes.string,
}

ErrorMessage.defaultProps = {
  msg: 'Uh oh! Something broke.',
}

export default ErrorMessage
