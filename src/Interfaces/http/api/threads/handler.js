const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadsHandler = this.postThreadsHandler.bind(this);
    this.getDetailThreadsHandler = this.getDetailThreadsHandler.bind(this);
  }

  async postThreadsHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const { id: owner } = request.auth.credentials;
    const payloads = {
      owner,
      title: request.payload.title,
      body: request.payload.body,
    };

    const addedThread = await addThreadUseCase.execute(payloads);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getDetailThreadsHandler(request, h) {
    const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);

    const { threadId } = request.params;
    const payloads = {
      threadId,
    };
    const thread = await getDetailThreadUseCase.execute(payloads);
    const response = h.response({
      status: 'success',
      data: { thread },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
