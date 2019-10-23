import React from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import UserForm from 'components/UserForm'

import { signUpErrorCodes } from 'schemaValues'

const SIGN_UP = gql`
  mutation SignUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      success
      message
      token
    }
  }
`

const SignUp = ({ logIn }) => {
  const [submitSignUp, { data, loading, error }] = useMutation(SIGN_UP, {
    onCompleted({ signUp: { success, token } }) {
      if (success) logIn(token)
    },
    // Catches fully malformed requests
    onError() {},
  })

  let errorMsg
  if (data && data.signUp) {
    const { INCOMPLETE_DATA, ALREADY_EXISTS } = signUpErrorCodes
    if (data.signUp.message === INCOMPLETE_DATA) errorMsg = 'Email and password required'
    else if (data.signUp.message === ALREADY_EXISTS) errorMsg = `That user already exists`
    else if (!data.signUp.success) errorMsg = 'Something went wrong - please retry'
  }
  if (error) errorMsg = 'Something went wrong - please retry'

  return (
    <UserForm
      title="Sign Up"
      loading={loading}
      errorMsg={errorMsg}
      buttonText="Sign Up"
      onSubmit={submitSignUp}
    />
  )
}

SignUp.propTypes = {
  logIn: PropTypes.func.isRequired,
}

export default SignUp
