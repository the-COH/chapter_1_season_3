import { Container } from '@mui/material'
import * as React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Dashbaord'
import Account from './Account'
import NewSplit from './NewSplit'
import NewWaterfall from './NewWaterfall'
import Explore from './Explore'

const Content = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Routes>
        <Route path="" element={<Dashboard />} />
        <Route path="accounts/:accountID" element={<Account />} />
        <Route path="split" element={<NewSplit />} />
        <Route path="waterfall" element={<NewWaterfall />} />
        <Route path="explore" element={<Explore />} />
        <Route path="*" element={<p>There's nothing here!</p>} />
      </Routes>
    </Container>
  )
}
export default Content
