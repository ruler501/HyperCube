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
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import {
  Collapse,
  Modal,
  ModalHeader,
  ModalBody,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput,
  ModalFooter,
  Input,
} from 'reactstrap';

import CommentPropType from '@cubeartisan/client/proptypes/CommentPropType.js';
import TimeAgo from '@cubeartisan/client/components/TimeAgo.js';
import UserContext from '@cubeartisan/client/components/contexts/UserContext.js';
import LinkButton from '@cubeartisan/client/components/LinkButton.js';
import CommentContextMenu from '@cubeartisan/client/components/CommentContextMenu.js';
import CSRFForm from '@cubeartisan/client/components/CSRFForm.js';
import useComments from '@cubeartisan/client/hooks/UseComments.js';
import useToggle from '@cubeartisan/client/hooks/UseToggle.js';
import CommentEntry from '@cubeartisan/client/components/CommentEntry.js';
import Markdown from '@cubeartisan/client/components/markdown/Markdown.js';

const maxDepth = 4;

const Comment = ({ comment, index, depth, noReplies, editComment }) => {
  const user = useContext(UserContext);
  const userid = user && user._id;

  const [replyExpanded, toggleReply] = useToggle(false);
  const [expanded, toggle] = useToggle(false);
  const [comments, addComment, , editChildComment] = useComments('comment', comment._id);
  const [loaded, setLoaded] = useState(false);
  const [shareModalOpen, toggleShareModal] = useToggle(false);
  const [reportModalOpen, toggleReportModal] = useToggle(false);
  const [isEdit, setIsEdit] = useState(false);

  const remove = () => {
    editComment({
      _id: comment._id,
      parent: comment.parent,
      parentType: comment.parentType,
      owner: null,
      ownerName: null,
      content: '[deleted]',
      timePosted: new Date(),
      updated: true,
      image: 'https://img.scryfall.com/cards/art_crop/front/0/c/0c082aa8-bf7f-47f2-baf8-43ad253fd7d7.jpg?1562826021',
      artist: 'Allan Pollack',
    });
  };

  const edit = (content) => {
    editComment({
      _id: comment._id,
      parent: comment.parent,
      parentType: comment.parentType,
      owner: comment.owner,
      ownerName: comment.ownerName,
      content,
      timePosted: new Date(),
      updated: true,
      image: comment.image,
      artist: comment.artist,
    });
  };

  return (
    <>
      <Modal isOpen={shareModalOpen} toggle={toggleShareModal} size="md">
        <ModalHeader toggle={toggle}>Share this Comment</ModalHeader>
        <ModalBody>
          <a href={`/comment/${comment._id}`}>Link to Comment</a>
        </ModalBody>
      </Modal>
      <Modal isOpen={reportModalOpen} toggle={toggleReportModal} size="lg">
        <CSRFForm method="POST" action={`/comment/${comment._id}/report`} autoComplete="off">
          <ModalHeader toggle={toggle}>Report this Comment</ModalHeader>
          <ModalBody>
            <InputGroup className="mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>Report Reason:</InputGroupText>
              </InputGroupAddon>
              <CustomInput type="select" id="reason" name="reason">
                <option>This is spam or phishing</option>
                <option>This is offensive or abusive</option>
                <option>It expresses intentions of self-harm or suicide</option>
              </CustomInput>
            </InputGroup>
            <Input
              type="textarea"
              className="w-100"
              id="info"
              name="info"
              placeholder="Put any additional comments here."
            />
            <Input type="hidden" name="commentid" value={comment._id} />
          </ModalBody>
          <ModalFooter>
            <Button color="success">Submit Report</Button>
            <Button color="danger" onClick={toggleReportModal}>
              Cancel
            </Button>
          </ModalFooter>
        </CSRFForm>
      </Modal>
      <div className={`pl-2 pt-2 flex-container${index % 2 === 0 ? ' comment-bg-even' : ' comment-bg-odd'}`}>
        <a href={`/user/${comment.owner}`}>
          <img className="profile-thumbnail" src={comment.image} alt={comment.artist} title={comment.artist} />
        </a>
        <div className="flex-grow ml-2">
          <div className="flex-container flex-direction-col">
            <div className="flex-container flex-space-between">
              <div>
                {comment.ownerName ? (
                  <a href={`/user/${comment.owner}`}>
                    <small>{comment.ownerName}</small>
                  </a>
                ) : (
                  <small>Anonymous</small>
                )}
                {comment.timePosted &&
                  (comment.updated ? (
                    <em>
                      <small>
                        {' '}
                        - Updated <TimeAgo date={comment.timePosted} />
                      </small>
                    </em>
                  ) : (
                    <small>
                      {' '}
                      - <TimeAgo date={comment.timePosted} />
                    </small>
                  ))}
              </div>
              {comment.owner === userid && (
                <div>
                  <CommentContextMenu comment={comment} value="..." edit={() => setIsEdit(true)} remove={remove}>
                    <small>...</small>
                  </CommentContextMenu>
                </div>
              )}
            </div>
            <Collapse isOpen={!isEdit}>
              <p className="mb-0">
                <Markdown markdown={comment.content} limited />
              </p>
            </Collapse>
            <CommentEntry
              submit={(res) => {
                edit(res);
                setIsEdit(false);
              }}
              expanded={isEdit}
              defaultValue={comment.content}
              toggle={() => setIsEdit(false)}
            />
            <div>
              {!noReplies && userid && (
                <LinkButton onClick={toggleReply}>
                  <small>Reply</small>
                </LinkButton>
              )}
              {!noReplies && comments.length > 0 && depth < maxDepth && (
                <LinkButton
                  className="ml-2"
                  onClick={() => {
                    toggle();
                    setLoaded(true);
                  }}
                >
                  <small>{`${expanded ? 'Hide' : 'View'} Replies (${comments.length})`}</small>
                </LinkButton>
              )}
              {!noReplies && comments.length > 0 && depth >= maxDepth && (
                <a className="m-2" href={`/comment/${comment._id}`}>
                  <small>{`View ${comments.length} ${comments.length > 1 ? 'replies' : 'reply'} in new page...`}</small>
                </a>
              )}
              <LinkButton className="ml-2" onClick={toggleShareModal}>
                <small>Share</small>
              </LinkButton>
              <LinkButton className="ml-2" onClick={toggleReportModal}>
                <small>Report</small>
              </LinkButton>
            </div>
            <CommentEntry
              submit={(res) => {
                addComment(res);
                setLoaded(true);
                if (!expanded) {
                  toggle();
                }
              }}
              expanded={replyExpanded}
              toggle={toggleReply}
            />
            {loaded && comments.length > 0 && (
              <Collapse className="border-left" isOpen={expanded}>
                {comments
                  .slice(0)
                  .reverse()
                  .map((item, pos) => (
                    <Comment
                      key={`comment-${comment._id}`}
                      comment={item}
                      index={index + comments.length - pos}
                      depth={depth + 1}
                      editComment={editChildComment}
                    />
                  ))}
                {comments.length > 10 && (
                  <a className="m-2" href={`/comment/${comment._id}`}>
                    View All...
                  </a>
                )}
              </Collapse>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

Comment.propTypes = {
  comment: CommentPropType.isRequired,
  index: PropTypes.number.isRequired,
  depth: PropTypes.number,
  noReplies: PropTypes.bool,
  editComment: PropTypes.func.isRequired,
};

Comment.defaultProps = {
  depth: 0,
  noReplies: false,
};

export default Comment;
