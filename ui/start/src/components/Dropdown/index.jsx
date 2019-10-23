import React from 'react'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import PropTypes from 'prop-types'

const Dropdown = ({ className, label, name, value, id, options, error, onChange }) => (
  <FormControl className={className} error={error}>
    {label && <InputLabel htmlFor={id || `dropdown_${name}`}>{label}</InputLabel>}
    <Select
      value={value}
      onChange={onChange}
      input={<Input name={name} id={id || `dropdown_${name}`} />}
    >
      {options.map(option => (
        <MenuItem key={`dropdown_${name}_${option.value}`} value={option.value}>
          {option.display}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)

Dropdown.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      display: PropTypes.string.isRequired,
    }),
  ).isRequired,
  error: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}

Dropdown.defaultProps = {
  label: null,
  className: 'w-100',
  id: null,
}

export default Dropdown
