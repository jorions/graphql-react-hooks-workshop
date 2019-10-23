import 'core-js/stable' // Import before everything to use throughout the app. This provides polyfills for our code.
import 'regenerator-runtime/runtime' // Needed to use the transpiled generator fns from core-js
import React from 'react'
import { render } from 'react-dom'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import lightBlue from '@material-ui/core/colors/lightBlue'
import red from '@material-ui/core/colors/red'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { ApolloProvider } from '@apollo/react-hooks'
import { BrowserRouter } from 'react-router-dom'

import App from 'components/App'

import { getUserToken, removeUser } from 'lib/storage'

import './styles/index.css'

const theme = createMuiTheme({
  // Move to the new material-ui typography
  // https://material-ui.com/style/typography/#migration-to-typography-v2
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { main: lightBlue.A400 },
    secondary: { main: green.A400 },
    error: { main: red.A400 },
  },
  overrides: {
    MuiFormControlLabel: {
      root: {
        marginLeft: '0px',
        marginRight: '0px',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        fontSize: '1rem',
      },
    },
  },
})

// Caches GraphQL results
const cache = new InMemoryCache()
// Creates an Apollo server-friendly HTTP request wrapper which points to our gateway
const httpLink = createHttpLink({ uri: 'http://localhost:4000/' })
// On each request we will attempt to get the user from local storage to set in our authorization headers
const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({ headers: { authorization: getUserToken() } })
  return forward(operation)
})
// When we receive back an authentication error fromm the service, remove the user
// from storage, and log out
const errorLink = onError(({ networkError }) => {
  if (
    networkError &&
    networkError.result &&
    networkError.result.errors.filter(
      ({ extensions }) => extensions && extensions.code === 'UNAUTHENTICATED',
    ).length
  ) {
    removeUser()
  }
})
const link = ApolloLink.from([middlewareLink, errorLink, httpLink])
const client = new ApolloClient({ cache, link })

render(
  <MuiThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </MuiThemeProvider>,
  document.getElementById('root'),
)
