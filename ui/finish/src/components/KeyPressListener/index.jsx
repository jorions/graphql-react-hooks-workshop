import { useEffect } from 'react'
import PropTypes from 'prop-types'

const KeyPressListener = ({ onKeyPress }) => {
  const handleKeyPress = evt => {
    if (evt.key === 'Enter') onKeyPress()
  }

  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress)
    return () => document.removeEventListener('keypress', handleKeyPress)
  }, [])

  return null
}

KeyPressListener.propTypes = {
  onKeyPress: PropTypes.func.isRequired,
}

export default KeyPressListener
