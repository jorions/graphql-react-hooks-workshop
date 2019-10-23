import React from 'react'
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types'

const TextInput = ({
  type,
  name,
  value,
  placeholder,
  label,
  inputProps,
  error,
  fullWidth,
  onChange,
}) => (
  <TextField
    type={type}
    name={name}
    value={value}
    id={name}
    placeholder={placeholder}
    label={label}
    InputProps={inputProps}
    error={error}
    fullWidth={fullWidth}
    onChange={onChange}
  />
)

TextInput.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  inputProps: PropTypes.shape(),
  error: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

TextInput.defaultProps = {
  type: 'text',
  placeholder: '',
  label: null,
  inputProps: null,
  error: null,
  fullWidth: false,
}

export default TextInput
