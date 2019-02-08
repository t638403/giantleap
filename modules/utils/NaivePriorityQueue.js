class NaivePriorityQueue {
	constructor(comparator = () => { throw new Error('Supply comparator function'); }) {
		this.q = [];
		this.c = comparator;
	}

	add(v) {
		this.q.push(v);
		this.q.sort((a, b) => this.c(a, b) ? -1 : 1);
	}

	peek() {
		return this.q[0];
	}

	poll() {
		return this.q.shift();
	}

	isEmpty() {
		return this.q.length === 0;
	}
}

module.exports = NaivePriorityQueue;
