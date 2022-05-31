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
import { Check, ContentCopy, SwapHoriz } from '@mui/icons-material';
import { Badge, Button, IconButton, Link, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Chart as ChartJS } from 'react-chartjs-2';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  CustomInput,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Nav,
  Row,
  TabContent,
  Table,
  TabPane,
} from 'reactstrap';

import CardImage from '@cubeartisan/client/components/CardImage.js';
import CommentsSection from '@cubeartisan/client/components/CommentsSection.js';
import CardGrid from '@cubeartisan/client/components/containers/CardGrid.js';
import PagedList from '@cubeartisan/client/components/containers/PagedList.js';
import CountTableRow from '@cubeartisan/client/components/CountTableRow.js';
import DynamicFlash from '@cubeartisan/client/components/DynamicFlash.js';
import withAutocard from '@cubeartisan/client/components/hoc/WithAutocard.js';
import withModal from '@cubeartisan/client/components/hoc/WithModal.js';
import ImageFallback from '@cubeartisan/client/components/ImageFallback.js';
import ButtonLink from '@cubeartisan/client/components/inputs/ButtonLink.js';
import MainLayout from '@cubeartisan/client/components/layouts/MainLayout.js';
import Markdown from '@cubeartisan/client/components/markdown/Markdown.js';
import AddToCubeModal from '@cubeartisan/client/components/modals/AddToCubeModal.js';
import Tab from '@cubeartisan/client/components/Tab.js';
import TextBadge from '@cubeartisan/client/components/TextBadge.js';
import useQueryParam from '@cubeartisan/client/hooks/useQueryParam.js';
import CardDataPointPropType from '@cubeartisan/client/proptypes/CardDataPointPropType.js';
import CardPricePropType from '@cubeartisan/client/proptypes/CardPricePropType.js';
import {
  getCardHoarderLink,
  getCardKingdomLink,
  getCardMarketLink,
  getTCGLink,
  nameToDashedUrlComponent,
} from '@cubeartisan/client/utils/Affiliate.js';
import {
  cardCubeCount,
  cardElo,
  cardFoilPrice,
  cardPopularity,
  cardPrice,
  cardPriceEur,
  cardTix,
} from '@cubeartisan/client/utils/Card.js';
import RenderToRoot from '@cubeartisan/client/utils/RenderToRoot.js';

const AutocardA = withAutocard(Link);
const AddModal = withModal(Button, AddToCubeModal);

const formatDate = (date) => `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

const distinct = (list) => {
  const res = [];
  const dates = new Set();
  for (const item of list) {
    const date = formatDate(item.x);
    if (!dates.has(date)) {
      res.push(item);
      dates.add(date);
    }
  }
  if (res.length > 0 && !dates.has(formatDate(new Date()))) {
    res.push({
      x: new Date(),
      y: res[res.length - 1].y,
    });
  }
  return res;
};

const Graph = ({ data, yFunc, unit, yRange }) => {
  const plot = {
    labels: [unit],
    datasets: [
      {
        lineTension: 0,
        pointRadius: 0,
        fill: false,
        borderColor: '#28A745',
        backgroundColor: '#28A745',
        data: distinct(
          data
            .map((point) => {
              try {
                return { x: new Date(point.date), y: yFunc(point.data) };
              } catch (exc) {
                return {}; // if the yFunc fails this will get filtered out
              }
            })
            .filter((point) => point.y),
        ),
      },
    ],
  };

  let options = {};

  if (plot.datasets[0].data.length > 0) {
    options = {
      legend: {
        display: false,
      },
      responsive: true,
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      scales: {
        xAxes: [
          {
            type: 'time',
            distribution: 'linear',
            time: {
              unit: 'day',
            },
            ticks: {
              min: plot.datasets[0].data[0].x,
            },
          },
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: unit,
            },
            ticks: yRange ? { min: yRange[0], max: yRange[1] } : {},
          },
        ],
      },
    };
  }

  if (plot.datasets[0].data.length > 0) {
    return <ChartJS options={options} data={plot} type="line" />;
  }
  return <p>No data to show.</p>;
};

Graph.propTypes = {
  data: PropTypes.arrayOf(CardDataPointPropType).isRequired,
  yFunc: PropTypes.func.isRequired,
  unit: PropTypes.string.isRequired,
  yRange: PropTypes.arrayOf(PropTypes.number),
};

Graph.defaultProps = {
  yRange: null,
};

const convertLegality = {
  legal: ['success', 'Legal'],
  not_legal: ['secondary', 'Not Legal'],
  banned: ['danger', 'Banned'],
  restricted: ['warning', 'Restricted'],
};

const LegalityBadge = ({ legality, status }) => (
  <h6>
    <Badge className="legality-badge" color={convertLegality[status][0]}>
      {convertLegality[status][1]}
    </Badge>{' '}
    {legality}
  </h6>
);

LegalityBadge.propTypes = {
  legality: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

const elementWrapper = (element) => (
  <table className="table table-striped mb-0">
    <thead>
      <tr>
        <th scope="col">Version</th>
        <th scope="col">USD</th>
        <th scope="col">USD Foil</th>
        <th scope="col">EUR</th>
        <th scope="col">TIX</th>
      </tr>
    </thead>
    <tbody>{element}</tbody>
  </table>
);

const CardIdBadge = ({ id }) => {
  const [copied, setCopied] = useState(false);

  const onCopyClick = async () => {
    await navigator.clipboard.writeText(id);
    setCopied(true);
  };

  return (
    <InputGroup className="flex-nowrap mb-3" size="sm">
      <InputGroupAddon addonType="prepend">
        <InputGroupText>Card ID</InputGroupText>
      </InputGroupAddon>
      <Input className="bg-white" value={id} disabled />
      <InputGroupAddon addonType="append">
        <IconButton size="small" onClick={onCopyClick} sx={{ width: 'auto' }}>
          {copied ? <Check /> : <ContentCopy />}
        </IconButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

CardIdBadge.propTypes = {
  id: PropTypes.string.isRequired,
};

const getPriceTypeUnit = {
  price: 'USD',
  price_foil: 'USD',
  eur: 'EUR',
  tix: 'TIX',
};

export const CardPage = ({ card, data, versions, related, loginCallback }) => {
  const [selectedTab, setSelectedTab] = useQueryParam('tab', '0');
  const [priceType, setPriceType] = useQueryParam('priceType', 'price');
  const [cubeType, setCubeType] = useQueryParam('cubeType', 'total');
  const [imageUsed, setImageUsed] = useState(card.image_normal);

  const sortedVersions = versions.sort((a, b) => {
    const date1 = new Date(a.released_at);
    const date2 = new Date(b.released_at);

    if (date1 > date2) {
      return -1;
    }
    if (date2 > date1) {
      return 1;
    }
    return 0;
  });

  const filteredVersions = sortedVersions.filter((version) => version._id !== card._id);

  return (
    <MainLayout loginCallback={loginCallback}>
      <DynamicFlash />
      <Card className="mt-2">
        <CardHeader>
          <h4>{card.name}</h4>
          <h6>{`${card.set_name} [${card.set.toUpperCase()}-${card.collector_number}]`}</h6>
        </CardHeader>
        <Row className="mt-2" noGutters>
          <Col className="pl-2 pb-2" xs="12" sm="3">
            <ImageFallback src={imageUsed} fallbackSrc="/content/default_card.png" alt={card.name} />
            {card.image_flip && (
              <Button
                color="success"
                variant="outlined"
                onClick={() => {
                  if (imageUsed === card.image_normal) {
                    setImageUsed(card.image_flip);
                  } else {
                    setImageUsed(card.image_normal);
                  }
                }}
                endIcon={<SwapHoriz />}
              >
                Transform
              </Button>
            )}
            <CardBody className="breakdown p-1">
              <p>
                Played in {cardPopularity({ details: card })}%
                <span className="percent">{cardCubeCount({ details: card })}</span> Cubes total.
              </p>
              <AddModal color="success" fullWidth variant="outlined" modalProps={{ card, hideAnalytics: true }}>
                Add to Cube...
              </AddModal>
              <CardIdBadge id={card._id} />
              {card.prices && Number.isFinite(cardPrice({ details: card })) && (
                <TextBadge name="Price">
                  <Tooltip title="TCGPlayer Market Price">
                    <Typography variant="body1">${cardPrice({ details: card }).toFixed(2)}</Typography>
                  </Tooltip>
                </TextBadge>
              )}
              {card.prices && Number.isFinite(cardFoilPrice({ details: card })) && (
                <TextBadge name="Foil">
                  <Tooltip title="TCGPlayer Market Price">
                    <Typography variant="body1">${cardFoilPrice({ details: card }).toFixed(2)}</Typography>
                  </Tooltip>
                </TextBadge>
              )}
              {card.prices && Number.isFinite(cardPriceEur({ details: card })) && (
                <TextBadge name="EUR">
                  <Tooltip title="Cardmarket Price">
                    <Typography variant="body1">€{cardPriceEur({ details: card }).toFixed(2)}</Typography>
                  </Tooltip>
                </TextBadge>
              )}
              {card.prices && Number.isFinite(cardTix({ details: card })) && (
                <TextBadge name="TIX">
                  <Tooltip title="MTGO TIX">
                    <Typography variant="body1">{cardTix({ details: card }).toFixed(2)}</Typography>
                  </Tooltip>
                </TextBadge>
              )}
              {Number.isFinite(cardElo({ details: card })) && (
                <TextBadge name="Elo">
                  <Tooltip title="Elo">
                    <Typography variant="body1">{cardElo({ details: card }).toFixed(0)}</Typography>
                  </Tooltip>
                </TextBadge>
              )}
            </CardBody>
          </Col>
          <Col className="breakdown" xs="12" sm="9">
            <Nav tabs>
              <Tab tab={selectedTab} setTab={setSelectedTab} index="0">
                Card
              </Tab>
              <Tab tab={selectedTab} setTab={setSelectedTab} index="1">
                Elo
              </Tab>
              <Tab tab={selectedTab} setTab={setSelectedTab} index="2">
                Price
              </Tab>
              <Tab tab={selectedTab} setTab={setSelectedTab} index="3">
                Play Rate
              </Tab>
              <Tab tab={selectedTab} setTab={setSelectedTab} index="4">
                Links
              </Tab>
              <Tab tab={selectedTab} setTab={setSelectedTab} index="5">
                Discussion
              </Tab>
            </Nav>
            <TabContent activeTab={selectedTab}>
              <TabPane tabId="0">
                <CardBody>
                  <Row>
                    <Col xs="6">
                      <div className="text-left">
                        <b>{card.name}</b>
                      </div>
                    </Col>
                    <Col xs="6">
                      <div className="text-right">
                        {card.parsed_cost
                          .slice(0)
                          .reverse()
                          .map((symbol) => (
                            <img
                              key={`mana-symbol-${symbol}`}
                              alt={symbol}
                              className="mana-symbol"
                              src={`/content/symbols/${symbol}.png`}
                            />
                          ))}
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <p className="my-0">{card.type}</p>
                  <hr />
                  <div className="my-0">
                    {card.oracle_text.split('\n').map((text) => (
                      <p key={`oracle-text-${text}`}>
                        <Markdown markdown={text} />
                      </p>
                    ))}
                  </div>
                  <Row>
                    <Col xs="6">
                      <div className="text-left">
                        <small>
                          <i>{`Illustrated by ${card.artist}`}</i>
                        </small>
                      </div>
                    </Col>
                    <Col xs="6">
                      <div className="text-right">
                        {card.loyalty && <p>{card.loyalty}</p>}
                        {card.power && <p>{`${card.power} / ${card.toughness}`}</p>}
                      </div>
                    </Col>
                  </Row>

                  <hr />
                  <Row>
                    <Col xs="12" sm="6">
                      {['Standard', 'Pioneer', 'Modern', 'Legacy', 'Vintage'].map((key) => (
                        <LegalityBadge key={key} legality={key} status={card.legalities[key]} />
                      ))}
                    </Col>
                    <Col xs="12" sm="6">
                      {['Brawl', 'Historic', 'Pauper', 'Penny', 'Commander'].map((key) => (
                        <LegalityBadge key={key} legality={key} status={card.legalities[key]} />
                      ))}
                    </Col>
                  </Row>
                </CardBody>
              </TabPane>
              <TabPane tabId="1">
                <CardBody>
                  <Graph unit="Elo" data={data.history} yFunc={(point) => point.elo} />
                </CardBody>
              </TabPane>
              <TabPane tabId="2">
                <CardBody>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>Price Type: </InputGroupText>
                    </InputGroupAddon>
                    <CustomInput
                      id="priceType"
                      type="select"
                      value={priceType}
                      onChange={(event) => setPriceType(event.target.value)}
                    >
                      <option value="price">USD</option>
                      <option value="price_foil">USD Foil</option>
                      <option value="eur">EUR</option>
                      <option value="tix">TIX</option>
                    </CustomInput>
                  </InputGroup>
                  <Graph
                    unit={getPriceTypeUnit[priceType]}
                    data={data.history}
                    yFunc={(point) => point.prices.filter((item) => item.version === card._id)[0][priceType]}
                  />
                </CardBody>
              </TabPane>
              <TabPane tabId="3">
                <CardBody>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>Cube Type: </InputGroupText>
                    </InputGroupAddon>
                    <CustomInput
                      id="cubeType"
                      type="select"
                      value={cubeType}
                      onChange={(event) => setCubeType(event.target.value)}
                    >
                      <option value="total">All</option>
                      <option value="vintage">Vintage</option>
                      <option value="legacy">Legacy</option>
                      <option value="modern">Modern</option>
                      <option value="standard">Standard</option>
                      <option value="peasant">Peasant</option>
                      <option value="pauper">Pauper</option>
                      <option value="size180">1-180 Cards</option>
                      <option value="size360">181-360 Cards</option>
                      <option value="size450">361-450 Cards</option>
                      <option value="size540">451-540 Cards</option>
                      <option value="size720">541+ Cards</option>
                    </CustomInput>
                  </InputGroup>
                  <Graph
                    unit="Percent of Cubes"
                    data={data.history}
                    yFunc={(point) => 100 * (point[cubeType] || [0, 0])[1]}
                    yRange={[0, 100]}
                  />
                  <Row className="pt-2">
                    <Col xs="12" sm="6" md="6" lg="6">
                      <h5>By Legality:</h5>
                      <Table bordered>
                        <tbody>
                          <CountTableRow label="Vintage" value={data.current.vintage || [0, 0]} />
                          <CountTableRow label="Legacy" value={data.current.legacy || [0, 0]} />
                          <CountTableRow label="Modern" value={data.current.modern || [0, 0]} />
                          <CountTableRow label="Standard" value={data.current.standard || [0, 0]} />
                          <CountTableRow label="Peasant" value={data.current.peasant || [0, 0]} />
                          <CountTableRow label="Pauper" value={data.current.pauper || [0, 0]} />
                        </tbody>
                      </Table>
                    </Col>
                    <Col xs="12" sm="6" md="6" lg="6">
                      <h5>By Size:</h5>
                      <Table bordered>
                        <tbody>
                          <CountTableRow label="1-180" value={data.current.size180 || [0, 0]} />
                          <CountTableRow label="181-360" value={data.current.size360 || [0, 0]} />
                          <CountTableRow label="361-450" value={data.current.size450 || [0, 0]} />
                          <CountTableRow label="451-540" value={data.current.size540 || [0, 0]} />
                          <CountTableRow label="541+" value={data.current.size720 || [0, 0]} />
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </CardBody>
              </TabPane>
              <TabPane tabId="4">
                <CardBody>
                  <Row>
                    <Col className="pb-2" xs="12" sm="6">
                      <ButtonLink
                        outline
                        color="success"
                        block
                        href={`/cubes/search/card:"${card.name}"/0`}
                        target="_blank"
                      >
                        {`Cubes with ${card.name}`}
                      </ButtonLink>
                    </Col>
                    <Col className="pb-2" xs="12" sm="6">
                      <ButtonLink
                        outline
                        color="success"
                        block
                        href={`/tool/searchcards?f=name%3A"${card.name}"&p=0&di=printings`}
                        target="_blank"
                      >
                        View all Printings
                      </ButtonLink>
                    </Col>
                    <Col className="pb-2" xs="12" sm="6">
                      <ButtonLink outline color="success" block href={card.scryfall_uri} target="_blank">
                        View on Scryfall
                      </ButtonLink>
                    </Col>
                    <Col className="pb-2" xs="12" sm="6">
                      <ButtonLink outline color="success" block href={getTCGLink({ details: card })} target="_blank">
                        View on TCGPlayer
                      </ButtonLink>
                    </Col>
                    <Col className="pb-2" xs="12" sm="6">
                      <ButtonLink
                        outline
                        color="success"
                        block
                        href={getCardKingdomLink({ details: card })}
                        target="_blank"
                      >
                        View on Card Kingdom
                      </ButtonLink>
                    </Col>
                    <Col className="pb-2" xs="12" sm="6">
                      <ButtonLink
                        outline
                        color="success"
                        block
                        href={`https://edhrec.com/cards/${nameToDashedUrlComponent(card.name)}`}
                        target="_blank"
                      >
                        View on EDHRec
                      </ButtonLink>
                    </Col>
                    <Col className="pb-2" xs="12" sm="6">
                      <ButtonLink
                        outline
                        color="success"
                        block
                        href={`http://mtgtop8.com/search?MD_check=1&SB_check=1&cards=${card.name}`}
                        target="_blank"
                      >
                        {`MTG Top 8 Decks with ${card.name}`}
                      </ButtonLink>
                    </Col>
                  </Row>
                </CardBody>
              </TabPane>
              <TabPane tabId="5">
                <div className="border-left border-bottom">
                  <CommentsSection parentType="card" parent={card.oracle_id} collapse={false} />
                </div>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Card>
      <Row>
        <Col xs="12" sm="6">
          <Card className="mt-4">
            <CardHeader>
              <h4>Versions</h4>
            </CardHeader>
            {filteredVersions.length > 0 ? (
              <PagedList
                pageSize={10}
                pageWrap={elementWrapper}
                rows={filteredVersions.slice(0).map((version) => (
                  <tr key={version._id}>
                    <td>
                      <AutocardA
                        front={version.image_normal}
                        back={version.image_flip || undefined}
                        href={`/card/${version._id}`}
                      >
                        {`${version.set_name} [${version.set.toUpperCase()}-${version.collector_number}]`}
                      </AutocardA>
                    </td>
                    <td>{version.prices.usd ? `$${version.prices.usd}` : ''}</td>
                    <td>{version.prices.usd_foil ? `$${version.prices.usd_foil}` : ''}</td>
                    <td>{version.prices.eur ? `€${version.prices.eur}` : ''}</td>
                    <td>{version.prices.tix ? `${version.prices.tix}` : ''}</td>
                  </tr>
                ))}
              />
            ) : (
              <CardBody>
                <p>No other versions</p>
              </CardBody>
            )}
          </Card>
        </Col>
        <Col xs="12" sm="6">
          <Card className="mt-4">
            <CardHeader>
              <h4>Purchase</h4>
            </CardHeader>
            <CardBody>
              <ButtonLink outline color="success" block href={getTCGLink({ details: card })} target="_blank">
                <Row>
                  <Col xs="6">
                    <div className="text-left">
                      <b>TCGPlayer</b>
                    </div>
                  </Col>
                  {card.prices.usd && (
                    <Col xs="6">
                      <div className="text-right">
                        <b>{`$${card.prices.usd.toFixed(2)}`}</b>
                      </div>
                    </Col>
                  )}
                </Row>
              </ButtonLink>
              <ButtonLink outline color="success" block href={getCardKingdomLink({ details: card })} target="_blank">
                <Row>
                  <Col xs="6">
                    <div className="text-left">
                      <b>Card Kingdom</b>
                    </div>
                  </Col>
                </Row>
              </ButtonLink>
              <ButtonLink outline color="success" block href={getCardMarketLink({ details: card })} target="_blank">
                <Row>
                  <Col xs="6">
                    <div className="text-left">
                      <b>CardMarket</b>
                    </div>
                  </Col>
                  {card.prices.eur && (
                    <Col xs="6">
                      <div className="text-right">
                        <b>{`€${card.prices.eur.toFixed(2)}`}</b>
                      </div>
                    </Col>
                  )}
                </Row>
              </ButtonLink>
              <ButtonLink outline color="success" block href={getCardHoarderLink({ details: card })} target="_blank">
                <Row>
                  <Col xs="6">
                    <div className="text-left">
                      <b>CardHoarder</b>
                    </div>
                  </Col>
                  {card.prices.tix && (
                    <Col xs="6">
                      <div className="text-right">
                        <b>{`${card.prices.tix.toFixed(2)} TIX`}</b>
                      </div>
                    </Col>
                  )}
                </Row>
              </ButtonLink>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Card className="my-3">
        <CardHeader>
          <h4>Often Drafted With</h4>
        </CardHeader>
        <CardBody>
          <h4>Most Synergistic Cards</h4>
          <CardGrid
            cardList={related.synergistic.map((item) => ({ details: item }))}
            Tag={CardImage}
            colProps={{ xs: 4, sm: 3, md: 2 }}
            cardProps={{ autocard: true, 'data-in-modal': true, className: 'clickable' }}
            linkDetails
          />
          <hr />
          <h4>Top Cards</h4>
          <CardGrid
            cardList={related.top.map((item) => ({ details: item }))}
            Tag={CardImage}
            colProps={{ xs: 4, sm: 3, md: 2 }}
            cardProps={{ autocard: true, 'data-in-modal': true, className: 'clickable' }}
            linkDetails
          />
          <hr />
          <h4>Creatures</h4>
          <CardGrid
            cardList={related.creatures.map((item) => ({ details: item }))}
            Tag={CardImage}
            colProps={{ xs: 4, sm: 3, md: 2 }}
            cardProps={{ autocard: true, 'data-in-modal': true, className: 'clickable' }}
            linkDetails
          />
          <hr />
          <h4>Spells</h4>
          <CardGrid
            cardList={related.spells.map((item) => ({ details: item }))}
            Tag={CardImage}
            colProps={{ xs: 4, sm: 3, md: 2 }}
            cardProps={{ autocard: true, 'data-in-modal': true, className: 'clickable' }}
            linkDetails
          />
          <hr />
          <h4>Other</h4>
          <CardGrid
            cardList={related.other.map((item) => ({ details: item }))}
            Tag={CardImage}
            colProps={{ xs: 4, sm: 3, md: 2 }}
            cardProps={{ autocard: true, 'data-in-modal': true, className: 'clickable' }}
            linkDetails
          />
        </CardBody>
      </Card>
    </MainLayout>
  );
};

CardPage.propTypes = {
  card: PropTypes.shape({
    name: PropTypes.string.isRequired,
    elo: PropTypes.number.isRequired,
    image_normal: PropTypes.string.isRequired,
    image_flip: PropTypes.string,
    scryfall_uri: PropTypes.string.isRequired,
    tcgplayer_id: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
    set: PropTypes.string.isRequired,
    set_name: PropTypes.string.isRequired,
    collector_number: PropTypes.string.isRequired,
    legalities: PropTypes.shape({}).isRequired,
    parsed_cost: PropTypes.arrayOf(PropTypes.string).isRequired,
    oracle_text: PropTypes.string.isRequired,
    oracle_id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    loyalty: PropTypes.string.isRequired,
    power: PropTypes.string.isRequired,
    toughness: PropTypes.shape({}).isRequired,
    prices: CardPricePropType.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    history: PropTypes.arrayOf(CardDataPointPropType).isRequired,
    current: CardDataPointPropType,
  }).isRequired,
  related: PropTypes.shape({
    top: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        image_normal: PropTypes.string.isRequired,
      }),
    ).isRequired,
    synergistic: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        image_normal: PropTypes.string.isRequired,
      }),
    ).isRequired,
    creatures: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        image_normal: PropTypes.string.isRequired,
      }),
    ).isRequired,
    spells: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        image_normal: PropTypes.string.isRequired,
      }),
    ).isRequired,
    other: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        image_normal: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      set_name: PropTypes.string.isRequired,
      image_normal: PropTypes.string.isRequired,
      image_flip: PropTypes.string,
      collector_number: PropTypes.string,
      prices: CardPricePropType.isRequired,
    }).isRequired,
  ).isRequired,
  loginCallback: PropTypes.string,
};

CardPage.defaultProps = {
  loginCallback: '/',
};

export default RenderToRoot(CardPage);
