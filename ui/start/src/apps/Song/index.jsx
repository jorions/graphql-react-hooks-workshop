import React from 'react'
import PropTypes from 'prop-types'

import './styles.css'

const Song = ({
  match: {
    params: { id },
  },
}) => <div>Song</div>

Song.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default Song
