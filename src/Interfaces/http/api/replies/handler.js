const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.addRepliesHandler = this.addRepliesHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async addRepliesHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

    const { id: owner } = request.auth.credentials;
    const payloads = {
      owner,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      content: request.payload.content,
    };

    const addedReply = await addReplyUseCase.execute(payloads);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);

    const { id: owner } = request.auth.credentials;
    const payloads = {
      owner,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      replyId: request.params.replyId,
    };

    await deleteReplyUseCase.execute(payloads);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
