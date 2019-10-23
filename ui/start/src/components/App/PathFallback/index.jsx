import React from 'react'
import Typography from '@material-ui/core/Typography'

import './styles.css'

const PathFallback = () => (
  <div className="ph4 flex-centered" styleName="message">
    <div>
      <Typography className="w-100" variant="h1" align="center" gutterBottom color="secondary">
        404
      </Typography>
      <Typography className="w-100 mt3" variant="h5" align="center" gutterBottom color="primary">
        "Somewhere, something incredible is waiting to be known."
      </Typography>
      <Typography className="w-100" variant="h6" align="center" gutterBottom color="primary">
        <i>-Carl Sagan</i>
      </Typography>
      <Typography className="w-100 mt4" variant="h6" align="center" color="textSecondary">
        Too bad that somewhere isn't here, because this page doesn't exist.
      </Typography>
    </div>
  </div>
)

export default PathFallback
