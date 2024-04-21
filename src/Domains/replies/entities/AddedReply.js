/* eslint-disable class-methods-use-this */
class AddedReply {
  constructor(payloads) {
    this._verifyPayload(payloads);

    const {
      id, content, owner,
    } = payloads;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({
    id, content, owner,
  }) {
    if (!id || !content || !owner) {
      throw new Error('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedReply;
