import React, { useState } from 'react'
import { hot } from 'react-hot-loader/root'
import { Route } from 'react-router-dom'
import { Redirect, Switch } from 'react-router'
import CssBaseline from '@material-ui/core/CssBaseline'

import ErrorBoundary from 'components/ErrorBoundary'
import HomePage from 'apps/HomePage'
import LogIn from 'apps/LogIn'
import SignUp from 'apps/SignUp'
import Profile from 'apps/Profile'
import User from 'apps/User'
import Song from 'apps/Song'

import { getUser, removeUser, setUser } from 'lib/storage'

import { logIn as logInRoute, signUp, profile, users, songs } from 'routes'

import Nav from './Nav'
import PathFallback from './PathFallback'

const App = () => {
  const [loggedIn, setLoggedIn] = useState(!!getUser())
  const logIn = token => {
    setUser(token)
    setLoggedIn(true)
  }
  const logOut = () => {
    removeUser()
  }

  return (
    <ErrorBoundary>
      <div className="flex">
        <CssBaseline />
        <Nav loggedIn={loggedIn} logOut={logOut} />
        <main className="p3">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route
              path={logInRoute}
              render={() => (loggedIn ? <Redirect to={profile} /> : <LogIn logIn={logIn} />)}
            />
            <Route
              path={signUp}
              render={() => (loggedIn ? <Redirect to={profile} /> : <SignUp logIn={logIn} />)}
            />
            <Route path={profile} render={() => (loggedIn ? <Profile /> : <Redirect to="/" />)} />
            <Route
              path={`${users}/:id`}
              render={props => {
                /* eslint-disable react/prop-types */
                const {
                  match: {
                    params: { id },
                  },
                } = props
                /* eslint-enable */
                const user = getUser()
                // Redirect to the user's profile if they click an item that belongs to them
                return user && user.id === Number(id) ? (
                  <Redirect to={profile} />
                ) : (
                  <User {...props} />
                )
              }}
            />
            <Route path={`${songs}/:id`} component={Song} />
            <Route component={PathFallback} />
          </Switch>
        </main>
      </div>
    </ErrorBoundary>
  )
}

// react-hot-loader automatically does not run when process.env === 'production'
export default hot(App)
