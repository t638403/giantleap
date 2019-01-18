class PriorityQueue {
	constructor(compare = (a, b) => a < b) {
		this.q = [];
		this.compare = compare;
	}

	push(a) {
		let i = 0;
		for(const b of this.q) {
			if(!this.compare(a, b)) {
				break;
			}
			i++;
		}
		this.q.splice(i, 0, a);
		return this;
	}

	pop() {
		return this.q.pop();
	}

	length() {
		return this.q.length;
	}

	toArray() {
		return this.q.slice(0);
	}
}

module.exports = PriorityQueue;