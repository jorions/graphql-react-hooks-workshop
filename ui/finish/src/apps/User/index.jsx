import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Typography from '@material-ui/core/Typography'

import Spinner from 'components/Spinner'
import ErrorMessage from 'components/ErrorMessage'
import Listing from 'components/Listing'

import './styles.css'

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      success
      user {
        email
        favorites {
          id
          artist
          createdAt
          name
          reason
        }
      }
    }
  }
`

const User = ({
  match: {
    params: { id },
  },
}) => {
  const { data, loading, error } = useQuery(GET_USER, { variables: { id } })

  if (loading) return <Spinner />
  if (error) return <ErrorMessage />

  const {
    user: { success },
  } = data
  if (!success) return <ErrorMessage msg="Uh oh! Looks like that user doesn't exist." />

  const {
    user: {
      user: { email, favorites },
    },
  } = data

  return (
    <>
      <Typography variant="h2" color="primary" className="w-100 center pv4">
        {`${email}'s Favorites`}
      </Typography>
      {favorites.map(({ id: songId, artist, createdAt, reason, name }) => (
        <Listing
          key={songId}
          songId={id}
          artist={artist}
          createdAt={createdAt}
          reason={reason}
          name={name}
          user={{ id, email }}
        />
      ))}
    </>
  )
}

User.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default User
