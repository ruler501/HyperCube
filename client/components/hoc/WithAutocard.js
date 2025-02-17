import React, { forwardRef, useContext, useRef } from 'react';
import { Col, PopoverBody, PopoverHeader, Row, UncontrolledPopover } from 'reactstrap';
import PropTypes from 'prop-types';

import TagContext from '@cubeartisan/client/components/contexts/TagContext.js';
import DisplayContext from '@cubeartisan/client/components/contexts/DisplayContext.js';
import {
  cardFinish,
  cardFullName,
  cardImageBackUrl,
  cardImageFlip,
  cardImageNormal,
  cardImageUrl,
  cardName,
  cardTags,
} from '@cubeartisan/client/utils/Card.js';
import CardPropType from '@cubeartisan/client/proptypes/CardPropType.js';

const placeholderClass = () => '';

const withAutocard = (Tag) => {
  const WithAutocard = forwardRef(({ card, front, back, tags, ...props }, ref) => {
    const tagContext = useContext(TagContext);
    const tagColorClass = tagContext?.tagColorClass ?? placeholderClass;
    const { showCustomImages } = useContext(DisplayContext);
    const backupRef = useRef();
    card = card ?? { details: {} };
    tags = tags ?? cardTags(card) ?? [];
    front = front || (showCustomImages && cardImageUrl(card)) || cardImageNormal(card);
    back = back || (showCustomImages && cardImageBackUrl(card)) || cardImageFlip(card);
    const foil = cardFinish(card) === 'Foil';
    const name = cardFullName(card);
    return (
      <>
        <Tag ref={ref ?? backupRef} {...props} />
        <UncontrolledPopover
          trigger="hover"
          placement="auto"
          delay={{ show: 50, hide: 250 }}
          hideArrow
          fade
          offset={12}
          target={ref ?? backupRef}
          popperClassName={`autocard-background autocardPopup ${back ? 'double-width' : ''}`}
          innerClassName="autocard-background no-gutters"
          className="autocard-background"
        >
          <PopoverHeader className="autocard-background">{name}</PopoverHeader>
          <PopoverBody className="autocard-background no-gutters p-0">
            <Row key="images" className="no-gutters">
              <Col key="front" className="position-relative card-border">
                {foil && <img key="foil" alt={cardName(card)} src="/content/foilOverlay.png" className="foilOverlay" />}
                <img key="frontImage" src={front} alt={back ? `${name} Front` : name} />
              </Col>
              {back && (
                <Col key="back" className="position-relative card-border">
                  {foil && (
                    <img
                      key="foil"
                      alt={`${cardName(card)}: Back`}
                      src="/content/foilOverlay.png"
                      className="foilOverlay"
                    />
                  )}
                  <img key="backImage" src={back} alt={`${name} Back`} />
                </Col>
              )}
            </Row>
            {tags && tags.length > 0 && (
              <Row key="tags" className="p-1 no-gutters">
                <Col>
                  {tags.map((tag) => (
                    <span className={`tag ${tagColorClass(tag.trim())}`} key={tag}>
                      {tag.trim()}
                    </span>
                  ))}
                </Col>
              </Row>
            )}
          </PopoverBody>
        </UncontrolledPopover>
      </>
    );
  });
  WithAutocard.propTypes = {
    card: CardPropType,
    front: PropTypes.string,
    back: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string.isRequired),
  };
  WithAutocard.defaultProps = {
    card: null,
    front: null,
    back: null,
    tags: null,
  };
  if (typeof Tag === 'string') {
    WithAutocard.displayName = `${Tag}WithAutocard`;
  } else if (Tag.displayName) {
    WithAutocard.displayName = `${Tag.displayName}WithAutocard`;
  } else if (Tag.name) {
    WithAutocard.displayName = `${Tag.name}WithAutocard`;
  } else {
    WithAutocard.displayName = 'WithAutocard';
  }
  return WithAutocard;
};

export default withAutocard;
