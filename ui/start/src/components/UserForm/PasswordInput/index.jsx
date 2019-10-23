import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye'
import RemoveRedEyeOutlinedIcon from '@material-ui/icons/RemoveRedEyeOutlined'

import TextInput from 'components/TextInput'

const PasswordInput = ({ password, error, onChange }) => {
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => setShowPassword(!showPassword)

  const inputType = showPassword ? 'input' : 'password'

  return (
    <TextInput
      type={inputType}
      name="password"
      value={password}
      placeholder="Password"
      label="Password"
      error={error}
      inputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button className="mt-2" color="primary" onClick={toggleShowPassword}>
              {showPassword ? <RemoveRedEyeIcon /> : <RemoveRedEyeOutlinedIcon />}
            </Button>
          </InputAdornment>
        ),
      }}
      fullWidth
      onChange={onChange}
    />
  )
}

PasswordInput.propTypes = {
  password: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default PasswordInput
