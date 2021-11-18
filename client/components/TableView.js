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
import { Container, Grid, Typography } from '@mui/material';

import CardPropType from '@cubeartisan/client/proptypes/CardPropType.js';
import { countGroup, sortDeep } from '@cubeartisan/client/utils/Sort.js';
import AutocardListGroup from '@cubeartisan/client/components/AutocardListGroup.js';
import AutocardListItem from '@cubeartisan/client/components/AutocardListItem.js';
import DisplayContext from '@cubeartisan/client/components/contexts/DisplayContext.js';
import SortContext from '@cubeartisan/client/components/contexts/SortContext.js';

const TableView = ({ cards, rowTag, noGroupModal, className, ...props }) => {
  const { primary, secondary, tertiary, quaternary, showOther } = useContext(SortContext);
  const { compressedView } = useContext(DisplayContext);


  const sorted = sortDeep(cards, showOther, quaternary, primary, secondary);
  const columns = { xs: Math.min(sorted.length, 2), md: Math.min(sorted.length, 9) }
  return (
    <Container maxWidth={false} disableGutters>
      <Grid container spacing={1} columns={columns}>
        {sorted.map(([columnLabel, column]) => (
          <Grid item
            key={columnLabel}
            xs={1}
            md={1}
            className="table-col"
          >
            <Typography variant="h6">
            <>{columnLabel}{': '}{countGroup(column)}</>
            </Typography>
            {column.map(([label, row]) => (
              <AutocardListGroup
                key={label}
                heading={`${label} (${countGroup(row)})`}
                cards={row}
                rowTag={rowTag}
                noGroupModal={noGroupModal}
                sort={tertiary}
                orderedSort={quaternary}
                showOther={showOther}
              />
            ))}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

TableView.propTypes = {
  cards: PropTypes.arrayOf(CardPropType).isRequired,
  rowTag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  noGroupModal: PropTypes.bool,
  className: PropTypes.string,
};

TableView.defaultProps = {
  rowTag: AutocardListItem,
  noGroupModal: false,
  className: null,
};

export default TableView;
