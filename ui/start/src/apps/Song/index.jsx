import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Typography from '@material-ui/core/Typography'

import Spinner from 'components/Spinner'
import ErrorMessage from 'components/ErrorMessage'

import { EVERYTHING, getSongErrorCodes } from 'schemaValues'

import './styles.css'

const GET_SONG = gql`
  query GetSong($id: ID!) {
    song(id: $id) {
      success
      message
      song {
        artist
        name
        lyrics
        reason
        user {
          id
          email
        }
      }
    }
  }
`

const Song = ({
  match: {
    params: { id },
  },
}) => {
  const { data, loading, error } = useQuery(GET_SONG, { variables: { id } })

  if (loading) return <Spinner />
  if (error) return <ErrorMessage />

  const {
    song: { success, message },
  } = data
  if (!success) {
    return message === getSongErrorCodes.NO_SONG ? (
      <ErrorMessage msg="Uh oh! Looks like that song doesn't exist." />
    ) : (
      <ErrorMessage />
    )
  }

  const {
    song: {
      song: { artist, name, lyrics, reason, user },
    },
  } = data
  return (
    <>
      <Typography variant="h2" color="primary" className="w-100 center pt4">
        {name}
      </Typography>
      <Typography variant="h5" color="textPrimary" className="w-100 center">
        by {artist}
      </Typography>
      <Typography
        variant="subtitle1"
        color="textSecondary"
        className="w-100 center"
        styleName="reason"
      >
        {user.email} loves {reason === EVERYTHING ? 'everything about it' : `the ${reason}`}
      </Typography>
      <Typography className="pt4" styleName="lyrics">
        {lyrics || `We couldn't find any lyrics for this song`}
      </Typography>
    </>
  )
}

Song.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default Song
