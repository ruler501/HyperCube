/**
 * This file is part of CubeArtisan.
 *
 * CubeArtisan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CubeArtisan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with CubeArtisan.  If not, see <https://www.gnu.org/licenses/>.
 *
 * Modified from the original version in CubeCobra. See LICENSE.CubeCobra for more information.
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

import RenderToRoot from '@cubeartisan/client/utils/RenderToRoot.js';
import Footer from '@cubeartisan/client/components/layouts/Footer.js';
import LoginModal from '@cubeartisan/client/components/modals/LoginModal.js';
import withModal from '@cubeartisan/client/components/hoc/WithModal.js';
import CardSearchBar from '@cubeartisan/client/components/CardSearchBar.js';
import SiteCustomizationContext from '@cubeartisan/client/components/contexts/SiteCustomizationContext.js';
import useToggle from '@cubeartisan/client/hooks/UseToggle.js';

const LoginModalButton = withModal(Button, LoginModal);

const BUTTON_SX = { maxWidth: '500', width: '33%', minWidth: 150, marginX: 'auto', marginY: 1 };

export const LandingPage = ({ numusers, numcubes, numdrafts }) => {
  const [loginIsOpen, toggleLoginModal] = useToggle(false);
  const { siteName } = useContext(SiteCustomizationContext);
  return (
    <Grid container sx={{ width: '100hw', minHeight: '100vh' }}>
      <Grid
        item
        container
        xs={12}
        sm={6}
        sx={{ backgroundColor: 'background.darker', height: '100vh' }}
        justifyContent="center"
        alignItems="center"
      >
        <img src="/content/LandingLogo.png" alt={siteName} />
      </Grid>
      <Grid item container xs={12} sm={6} sx={{ minHeight: '100vh', backgroundColor: 'background.primary' }}>
        <Box
          marginY={5}
          alignSelf="begin"
          width="80%"
          maxWidth="800"
          minWidth="160"
          top={0}
          position="relative"
          marginX="auto"
        >
          <CardSearchBar />
        </Box>
        <Stack alignSelf="stretch" width="100%">
          <Typography variant="h4" color="grey.800" align="center">
            Build, playtest, and share your Magic the Gathering cube!
          </Typography>
          <Typography variant="h5" align="center" color="grey.800" sx={{ marginBottom: 4 }}>
            <strong>{numusers}</strong>
            {' Users, '}
            <strong>{numcubes}</strong>
            {' Cubes, '}
            <strong>{numdrafts}</strong>
            {' Completed Drafts'}
          </Typography>
          <Button href="/user" color="primary" variant="contained" sx={BUTTON_SX}>
            Sign Up
          </Button>
          <LoginModalButton
            modalProps={{ loginCallback: '/', isOpen: loginIsOpen, toggle: toggleLoginModal }}
            color="primary"
            variant="contained"
            onClick={toggleLoginModal}
            sx={BUTTON_SX}
          >
            Login
          </LoginModalButton>
        </Stack>
        <Footer />
      </Grid>
    </Grid>
  );
};

LandingPage.propTypes = {
  numusers: PropTypes.string.isRequired,
  numcubes: PropTypes.string.isRequired,
  numdrafts: PropTypes.string.isRequired,
};

export default RenderToRoot(LandingPage);
