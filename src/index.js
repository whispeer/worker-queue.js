define(["PromiseWorker"], function (PromiseWorker) {
	/** constructor for promiseQueue
	*   @param Promise a promise implementation
	*   @param numberOfWorkers the number of workers you want to run in parallel
	*   @param workerPath path to the worker file
	*/
	var PromiseQueue = function (Promise, numberOfWorkers, workerPath, setupMethod, requireOverRide) {
		this._Promise = Promise;
		this._numberOfWorkers = numberOfWorkers;
		this._numberOfRunningWorkers = 0;

		this._workerPath = workerPath;
		this._requireOverRide = requireOverRide;

		this._queue = [];
		this._workers = [];

		this._setupMethod = setupMethod;
		this._setupDone = typeof setupMethod !== "function";
		this._setupRunning = false;
	};

	PromiseQueue.prototype._createNewWorker = function () {
		if (this._workers.length < this._numberOfWorkers) {
			var newWorker = new PromiseWorker(this._Promise, this._workerPath, this._requireOverRide);
			newWorker.onFree(this._onFree.bind(this, newWorker));
			this._workers.push(newWorker);
		}
	};

	PromiseQueue.prototype._onFree = function (worker) {
		if (this._workers.length > this._numberOfWorkers) {
			//remove from workers
			return;
		}

		if (this._setupRunning) {
			return;
		}

		if (!this._setupDone) {
			var that = this;
			this._setupRunning = true;
			this._setupMethod(worker, function () {
				that._setupRunning = false;
				that._setupDone = true;
				that._onFree(worker);
			});

			return;
		}

		this._runFromQueue();
	};

	PromiseQueue.prototype._runFromQueue = function () {
		this._workers.forEach(function (worker) {
			if (!worker.isBusy() && this._queue.length > 0) {
				var current = this._queue.shift();
				worker.runIfFree(current.task, current.metaListener).then(current.resolve, current.reject);
			}
		}, this);
	};

	PromiseQueue.prototype._saveCallBack = function (task, metaListener, resolve, reject) {
		this._queue.push({
			task: task,
			metaListener: metaListener,
			resolve: resolve,
			reject: reject
		});
	};

	/** schedule a new task
	*   @param the task to schedule
	*   @param metaListener a listener for meta information (e.g. progress)
	*/
	PromiseQueue.prototype.schedule = function (task, metaListener) {
		this._createNewWorker();

		var waitPromise =  new this._Promise(this._saveCallBack.bind(this, task, metaListener));
		this._runFromQueue();
		return waitPromise;
	};

	/** close all workers. finish remaining tasks first */
	PromiseQueue.prototype.drain = function () {
		this.setNumberOfWorkers(0);
	};

	PromiseQueue.prototype.setNumberOfWorkers = function (numberOfWorkers) {
		this._numberOfWorkers = numberOfWorkers;

		if (numberOfWorkers > this._numberOfWorkers) {
			for (var i = 0; i < queue.length; i += 1) {
				this._createNewWorker();
			}
		}
	};

	return PromiseQueue;
});