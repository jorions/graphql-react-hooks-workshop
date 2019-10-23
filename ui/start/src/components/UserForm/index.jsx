import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'

import TextInput from 'components/TextInput'
import Spinner from 'components/Spinner'
import KeyPressListener from 'components/KeyPressListener'
import PasswordInput from './PasswordInput'

import './styles.css'

const UserForm = ({ title, loading, errorMsg, buttonText, onSubmit }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Create an object that lives for the lifetime of the component.
  // This is necessary because we want the KeyPressListener to only add and remove
  // listeners on mount and unmount, but if we do that, the callback it uses will
  // only have the original password and email values that it had when it first mounted.
  // So we use a ref to persist this information across renders, and because the ref
  // is a stateful object, we can reference it directly in the callback.
  // Perhaps this is a case where a class component still makes sense to use, but
  // for the sake of example, this is how you would implement it with hooks.
  const formRef = useRef({ email: '', password: '' })

  const handleEmailChange = ({ target: { value } }) => {
    setEmail(value)
    formRef.current.email = value
  }
  const handlePasswordChange = ({ target: { value } }) => {
    setPassword(value)
    formRef.current.password = value
  }
  const handleSubmit = () => {
    onSubmit({ variables: { email: formRef.current.email, password: formRef.current.password } })
  }

  return (
    <>
      <KeyPressListener onKeyPress={handleSubmit} />
      <Card styleName="container" className="flex-centered mb4 pb4">
        <Typography variant="h2" color="primary" className="pt4">
          {title}
        </Typography>
        <div className="flex-centered w-100 mb4" />
        <div>
          <TextInput
            name="email"
            value={email}
            placeholder="Email"
            label="Email"
            error={!!errorMsg}
            fullWidth
            onChange={handleEmailChange}
          />
          <PasswordInput password={password} error={!!errorMsg} onChange={handlePasswordChange} />
          <FormHelperText error>{errorMsg}</FormHelperText>
          <div className="mv4 flex-centered h4">
            {loading ? (
              <div className="w4 h4">
                <Spinner size={40} />
              </div>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                fullWidth
              >
                {buttonText}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </>
  )
}

UserForm.propTypes = {
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  errorMsg: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

UserForm.defaultProps = {
  errorMsg: '',
}

export default UserForm
