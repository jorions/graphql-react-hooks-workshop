import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Typography from '@material-ui/core/Typography'

import { getUser } from 'lib/storage'

import Spinner from 'components/Spinner'
import ErrorMessage from 'components/ErrorMessage'
import Listing from 'components/Listing'

import './styles.css'

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      success
      user {
        favorites {
          id
          artist
          name
          reason
        }
      }
    }
  }
`

const Profile = () => {
  const { id, email } = getUser()

  const [favorites, setFavorites] = useState([])

  const { loading, error } = useQuery(GET_USER, {
    variables: { id },
    // We want to make sure this page is always as up-to-date as possible, so
    // don't rely on the default setting 'cache-first'
    fetchPolicy: 'network-only',
    onCompleted({ user: { success, user } }) {
      if (success) setFavorites(user.favorites)
    },
  })

  const removeFavorite = songId => {
    const idx = favorites.findIndex(fav => fav.id === songId)
    // Shallow copy the array of favorites so we don't mutate it directly, then
    // remove the appropriate song
    const updatedFavorites = [...favorites]
    updatedFavorites.splice(idx, 1)
    setFavorites(updatedFavorites)
  }

  if (loading) return <Spinner />
  if (error) return <ErrorMessage />

  return (
    <>
      <Typography variant="h2" color="primary" className="w-100 center pt4">
        Your Profile
      </Typography>
      <Typography variant="h6" color="textSecondary" className="w-100 center pt2 pb4">
        {email}
      </Typography>
      {favorites.map(song => (
        <Listing
          canEdit
          key={song.id}
          songId={song.id}
          artist={song.artist}
          createdAt={song.createdAt}
          reason={song.reason}
          name={song.name}
          removeFavorite={removeFavorite}
        />
      ))}
    </>
  )
}

export default Profile
