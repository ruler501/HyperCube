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
import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid } from '@mui/material';

import ErrorBoundary from '@cubeartisan/client/components/ErrorBoundary.js';
import Footer from '@cubeartisan/client/components/layouts/Footer.js';
import SiteAppBar from '@cubeartisan/client/components/SiteAppBar.js';

/**
 * @typedef { import("react").ReactNode } ReactNode
 * @typedef { import("react").FunctionComponent<{ children: ReactNode, loginCallback?: string }> } ComponentType
 * @type ComponentType
 */
const MainLayout = ({ children, loginCallback }) => {
  return (
    <Grid
      container
      sx={{ minHeight: '100vh', backgroundColor: 'background.primary', flexFlow: 'column' }}
      alignItems="center"
    >
      <Grid item sx={{ flex: '0 1 auto', width: '100%' }}>
        <SiteAppBar loginCallback={loginCallback} />
      </Grid>
      <Grid item sx={{ flex: '1 1 auto', width: '100%' }}>
        <Container maxWidth="xl" sx={{ flex: '1 1 auto' }}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Container>
      </Grid>
      <Grid item sx={{ flex: '0 1 auto' }}>
        <Footer />
      </Grid>
    </Grid>
  );
};
MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  loginCallback: PropTypes.string,
};
MainLayout.defaultProps = {
  loginCallback: '/',
};
export default MainLayout;
