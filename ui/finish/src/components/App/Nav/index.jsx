import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import BuildIcon from '@material-ui/icons/Build'
import TransitEnterExitIcon from '@material-ui/icons/TransitEnterexit'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import PersonIcon from '@material-ui/icons/Person'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'
import Button from '@material-ui/core/Button'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import { logIn, signUp, profile } from 'routes'

import styles from './styles.css'

// When passed as the 'component' prop into <Button> it must be able to hold a ref,
// but pure functional components are stateless and thus cannot hold a ref.
// So instead it must be a class.
class FormattedLink extends PureComponent {
  render() {
    return <NavLink activeClassName={styles.active} {...this.props} />
  }
}

const Link = ({ to, Icon, text, exact, styleClass, onClick }) => (
  <Button component={FormattedLink} to={to} exact={exact} styleName={styleClass} onClick={onClick}>
    <ListItem>
      <ListItemIcon>
        <Icon styleName="icon" />
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </ListItem>
  </Button>
)

Link.propTypes = {
  to: PropTypes.string.isRequired,
  Icon: PropTypes.shape({}).isRequired,
  text: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  styleClass: PropTypes.string,
  onClick: PropTypes.func,
}

Link.defaultProps = {
  exact: false,
  styleClass: '',
  onClick: () => {},
}

const Nav = ({ loggedIn, logOut }) => (
  <Drawer styleName="nav" variant="permanent" anchor="left">
    <List className="pt0">
      <Link to="/" Icon={BuildIcon} text="Workshop" exact styleClass="home" />
      <Divider />
      {!loggedIn && <Link to={logIn} Icon={TransitEnterExitIcon} text="Log In" />}
      {!loggedIn && <Link to={signUp} Icon={PersonAddIcon} text="Sign Up" />}
      {loggedIn && <Link to={profile} Icon={PersonIcon} text="Profile" />}
      {loggedIn && (
        <Button onClick={logOut} styleName="logOut">
          <ListItem>
            <ListItemIcon>
              <PowerSettingsNewIcon styleName="icon" />
            </ListItemIcon>
            <ListItemText>Log Out</ListItemText>
          </ListItem>
        </Button>
      )}
    </List>
  </Drawer>
)

Nav.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  logOut: PropTypes.func.isRequired,
}

export default Nav
