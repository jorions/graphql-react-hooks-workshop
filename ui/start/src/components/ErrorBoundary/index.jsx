import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import ErrorIcon from '@material-ui/icons/Error'

import './styles.css'

// Use a class instead of hooks to utilize the yet-to-be-implemented componentDidCatch
class ErrorBoundary extends Component {
  // This is a nice syntax enabled by babel and webpack. Under the hood this creates
  // a constructor with this.state = { error: null, componentStack: null }
  state = { error: null, componentStack: null }

  componentDidCatch(error, info) {
    this.setState({
      error,
      componentStack: (info && info.componentStack) || 'unknown component stack',
    })
  }

  renderError() {
    const { error, componentStack } = this.state

    return (
      <div id="errorStack" styleName="errorStack">
        <div>{error.toString()}</div>
        <div>{error.stack.replace(/(\r\n|\n|\r)/gm, '\n').split('\n')[1]}</div>
        <ul>
          {componentStack
            .replace(/(\r\n|\n|\r)/gm, '\n')
            .split('\n')
            .map((trace, idx) =>
              idx === 0 ? null : (
                <li key="trace" className="hide-bullets">
                  {trace}
                </li>
              ),
            )}
        </ul>
      </div>
    )
  }

  render() {
    const { children } = this.props
    const { error } = this.state

    return error ? (
      <>
        <CssBaseline />
        <Container className="center mt4 ph2" maxWidth="lg">
          <div>
            <ErrorIcon color="error" styleName="errorIcon" className="mb3" />
          </div>
          <Typography variant="h2" className="mb3">
            Well this is awkard...
          </Typography>
          <Typography variant="h4" className="mb3">
            The page just crashed :(
          </Typography>
          <Typography variant="h5" className="mb2">
            Refresh to fix the problem
          </Typography>
          <Typography variant="h6" styleName="request">
            Here's the full error:
          </Typography>
          <div className="flex-centered">{this.renderError()}</div>
        </Container>
      </>
    ) : (
      children
    )
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
