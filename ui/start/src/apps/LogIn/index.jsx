import React from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import UserForm from 'components/UserForm'

import { logInErrorCodes } from 'schemaValues'

const LOG_IN = gql`
  mutation LogIn($email: String!, $password: String!) {
    logIn(email: $email, password: $password) {
      success
      message
      token
    }
  }
`

const LogIn = ({ logIn }) => {
  const [submitLogIn, { data, loading, error }] = useMutation(LOG_IN, {
    onCompleted({ logIn: { success, token } }) {
      if (success) logIn(token)
    },
    // Catches fully malformed requests
    onError() {},
  })

  let errorMsg
  if (data && data.logIn) {
    const { NO_USER, INCOMPLETE_DATA, INVALID_PASSWORD } = logInErrorCodes
    if (data.logIn.message === NO_USER) errorMsg = `That user doesn't exist`
    else if (data.logIn.message === INCOMPLETE_DATA) errorMsg = 'Email and password required'
    else if (data.logIn.message === INVALID_PASSWORD) errorMsg = 'Invalid password'
    else if (!data.logIn.success) errorMsg = 'Something went wrong - please retry'
  }
  if (error) errorMsg = 'Something went wrong - please retry'

  return (
    <UserForm
      title="Log In"
      loading={loading}
      errorMsg={errorMsg}
      buttonText="Log In"
      onSubmit={submitLogIn}
    />
  )
}

LogIn.propTypes = {
  logIn: PropTypes.func.isRequired,
}

export default LogIn
