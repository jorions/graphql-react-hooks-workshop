import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Spinner from 'components/Spinner'
import ErrorMessage from 'components/ErrorMessage'
import Listing from 'components/Listing'

const GET_RECENT_FAVORITES = gql`
  query GetRecentFavorites {
    recentFavorites {
      id
      artist
      createdAt
      reason
      name
      user {
        id
        email
      }
    }
  }
`

const HomePage = () => {
  const { data, loading, error } = useQuery(GET_RECENT_FAVORITES)

  if (loading) return <Spinner />
  if (error) return <ErrorMessage />

  return data.recentFavorites.map(({ id, artist, createdAt, reason, name, user }) => (
    <Listing
      key={id}
      songId={id}
      artist={artist}
      createdAt={createdAt}
      reason={reason}
      name={name}
      user={user}
    />
  ))
}

export default HomePage
