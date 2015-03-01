define([], function () {
	/** constructor for promiseQueue
	*   @param Promise a promise implementation
	*   @param numberOfWorkers the number of workers you want to run in parallel
	*   @param workerPath path to the worker file
	*/
	var promiseQueue = function (Promise, numberOfWorkers, workerPath) {
		this._Promise = Promise;
		this._numberOfWorkers = numberOfWorkers;
		this._numberOfRunningWorkers = 0;
		this._workerPath = workerPath;
	};

	/** schedule a new task
	*   @param the task to schedule
	*   @param metaListener a listener for meta information (e.g. progress)
	*/
	promiseQueue.prototype.schedule = function (task, metaListener) {

	};

	/** close all workers. finish remaining tasks first */
	promiseQueue.prototype.drain = function () {
		this.setNumberOfWorkers(0);
	};

	promiseQueue.prototype.setNumberOfWorkers = function (numberOfWorkers) {
		if (numberOfWorkers > this._numberOfWorkers) {
			this._numberOfWorkers = numberOfWorkers;
		} else {
			//TODO
		}
	};
});