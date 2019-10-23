import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'

import { getUser } from 'lib/storage'

import Spinner from 'components/Spinner'
import ErrorMessage from 'components/ErrorMessage'
import Listing from 'components/Listing'
import TextInput from 'components/TextInput'
import Dropdown from 'components/Dropdown'

import { EVERYTHING, LYRICS, SOUND, addFavoriteErrorCodes } from 'schemaValues'

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

const ADD_FAVORITE = gql`
  mutation AddFavorite($artist: String!, $name: String!, $reason: Reason!) {
    addFavorite(artist: $artist, name: $name, reason: $reason) {
      success
      message
      song {
        id
        artist
        name
        reason
      }
    }
  }
`
const Profile = () => {
  const { id, email } = getUser()

  const [artist, setArtist] = useState('')
  const [name, setName] = useState('')
  const [reason, setReason] = useState('')
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

  const handleArtistChange = ({ target: { value } }) => {
    setArtist(value)
  }
  const handleNameChange = ({ target: { value } }) => {
    setName(value)
  }
  const handleReasonChange = ({ target: { value } }) => {
    setReason(value)
  }

  const addFavorite = song => {
    setFavorites([song, ...favorites])
  }
  const [submitAddFavorite, addFavoriteInfo] = useMutation(ADD_FAVORITE, {
    onCompleted({ addFavorite: { success, song } }) {
      if (success) addFavorite(song)
    },
    // Catches fully malformed requests
    onError() {},
  })
  const handleAddFavorite = () => {
    submitAddFavorite({ variables: { artist, name, reason } })
  }

  if (loading) return <Spinner />
  if (error) return <ErrorMessage />

  let addFavoriteErrorMsg
  if (
    addFavoriteInfo.data &&
    addFavoriteInfo.data.addFavorite &&
    addFavoriteInfo.data.addFavorite.success === false
  )
    addFavoriteErrorMsg =
      addFavoriteInfo.data.addFavorite.message === addFavoriteErrorCodes.INCOMPLETE_DATA
        ? 'Make sure all fields are filled out'
        : 'Something went wrong - please try again'
  if (addFavoriteInfo.error) addFavoriteErrorMsg = 'Something went wrong - please try again'

  return (
    <>
      <Typography variant="h2" color="primary" className="w-100 center pt4">
        Your Profile
      </Typography>
      <Typography variant="h6" color="textSecondary" className="w-100 center pt2 pb4">
        {email}
      </Typography>
      <div className="w-100 flex-centered">
        <Paper styleName="form">
          <Typography variant="h4" color="secondary" className="center pv3">
            Add a new favorite
          </Typography>
          <div styleName="text">
            <TextInput
              name="Song name"
              label="Artist name"
              value={name}
              onChange={handleNameChange}
              error={!!addFavoriteErrorMsg}
              fullWidth
            />
          </div>
          <div styleName="text">
            <TextInput
              name="Artist name"
              label="Artist name"
              value={artist}
              onChange={handleArtistChange}
              error={!!addFavoriteErrorMsg}
              fullWidth
            />
          </div>
          <div styleName="dropdown">
            <Dropdown
              name="Reason"
              label="Reason"
              className="pb2 w-100"
              options={[
                { value: EVERYTHING, display: 'Everything' },
                { value: LYRICS, display: 'Lyrics' },
                { value: SOUND, display: 'Sound' },
              ]}
              onChange={handleReasonChange}
              error={!!addFavoriteErrorMsg}
              value={reason}
            />
          </div>
          <FormHelperText className="flex-centered pb3 mt0" error>
            {addFavoriteErrorMsg}
          </FormHelperText>
          <div styleName="button">
            {addFavoriteInfo.loading ? (
              <div className="flex-centered">
                <Spinner size={40} color="secondary" />
              </div>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                onClick={handleAddFavorite}
                fullWidth
              >
                Add
              </Button>
            )}
          </div>
        </Paper>
      </div>
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
