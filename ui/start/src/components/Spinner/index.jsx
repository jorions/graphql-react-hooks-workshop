import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'

const Spinner = ({ size, color }) => <CircularProgress size={size} color={color} />

Spinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.oneOf(['primary', 'secondary']),
}

Spinner.defaultProps = {
  size: 100,
  color: 'primary',
}

export default Spinner
