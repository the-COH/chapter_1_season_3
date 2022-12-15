import React from 'react'
import { Skeleton, Grid } from '@mui/material'

const AccountSkeleton = () => {
  return (
    <>
      <Skeleton variant="rectangular" height={50} />
      <Grid container spacing={4} pt={3}>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" height={250} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" height={200} />
        </Grid>
      </Grid>
    </>
  )
}

export default AccountSkeleton
