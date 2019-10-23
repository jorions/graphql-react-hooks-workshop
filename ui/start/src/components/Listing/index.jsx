import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import DeleteIcon from '@material-ui/icons/Delete'

import { songs, users } from 'routes'
import { EVERYTHING, LYRICS, SOUND } from 'schemaValues'

import Dropdown from 'components/Dropdown'
import Spinner from 'components/Spinner'

import './styles.css'

const UPDATE_FAVORITE = gql`
  mutation UpdateFavorite($id: ID!, $reason: Reason!) {
    updateFavorite(id: $id, reason: $reason) {
      success
      song {
        reason
      }
    }
  }
`
const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($id: ID!) {
    removeFavorite(id: $id) {
      success
      song {
        id
      }
    }
  }
`

const Listing = ({ canEdit, songId, artist, createdAt, reason, name, user, removeFavorite }) => {
  const [newReason, updateReasonLocally] = useState(reason)
  const [submitReasonUpdate, updateInfo] = useMutation(UPDATE_FAVORITE, {
    onCompleted({ updateFavorite: { success, song } }) {
      if (success) updateReasonLocally(song.reason)
    },
    // Catches fully malformed requests
    onError() {},
  })
  const [submitFavoriteRemove] = useMutation(REMOVE_FAVORITE, {
    onCompleted({ removeFavorite: { success, song } }) {
      if (success) removeFavorite(song.id)
    },
    // Catches fully malformed requests
    onError() {},
  })

  const handleReasonChange = ({ target: { value } }) => {
    submitReasonUpdate({ variables: { id: songId, reason: value } })
  }
  const handleDelete = e => {
    e.preventDefault() // Stop the link click from propagating
    submitFavoriteRemove({ variables: { id: songId } })
  }

  const errorUpdatingReason = !!(
    updateInfo.error ||
    (updateInfo.data &&
      updateInfo.data.updateFavorite &&
      updateInfo.data.updateFavorite.success === false)
  )

  const formattedDate = new Date(createdAt).toLocaleString()
  return (
    <Card styleName="card">
      <CardActionArea component={Link} to={`${songs}/${songId}`}>
        {canEdit && (
          <div styleName="delete">
            <DeleteIcon style={{ fontSize: 40 }} onClick={handleDelete} />
          </div>
        )}
        <Typography color="primary" variant="h4" className="p2">
          {name}
        </Typography>
        <span>
          <Typography variant="subtitle1" color="textSecondary" styleName="subtitle">
            by: {artist}
          </Typography>
        </span>
      </CardActionArea>
      {canEdit ? (
        <div styleName="details">
          <Typography variant="subtitle2">What you like about this song:</Typography>
          {updateInfo.loading ? (
            <div className="flex-centered pt2">
              <Spinner size={40} color="secondary" />
            </div>
          ) : (
            <Dropdown
              name={`reason ${songId}`}
              className="w-100 pt2"
              options={[
                { value: EVERYTHING, display: 'Everything' },
                { value: LYRICS, display: 'Lyrics' },
                { value: SOUND, display: 'Sound' },
              ]}
              onChange={handleReasonChange}
              error={errorUpdatingReason}
              value={newReason}
            />
          )}
        </div>
      ) : (
        <CardActionArea component={Link} to={`${users}/${user.id}`}>
          <div styleName="details">
            <Typography>Favorited by {user.email}</Typography>
            <Typography variant="caption"> on {formattedDate}</Typography>
            <Typography variant="subtitle2" className="pt2">
              They love{' '}
              <span styleName="reason">
                {reason === EVERYTHING ? 'everything about it' : `the ${reason}`}
              </span>
            </Typography>
          </div>
        </CardActionArea>
      )}
    </Card>
  )
}

Listing.propTypes = {
  canEdit: PropTypes.bool,
  songId: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  reason: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
  removeFavorite: PropTypes.func,
}

Listing.defaultProps = {
  canEdit: false,
  createdAt: null,
  user: null,
  removeFavorite: null,
}

export default Listing
