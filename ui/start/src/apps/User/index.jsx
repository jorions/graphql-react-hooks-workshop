import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const User = ({
  match: {
    params: { id },
  },
}) => <div>User</div>

User.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default User
