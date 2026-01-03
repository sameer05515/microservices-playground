class Queue {
  constructor() {
    this.items = [];
    this.frontIndex = 0;
  }

  enqueue(value) { this.items.push(value); }

  dequeue() {
    if (this.isEmpty()) return undefined;
    const value = this.items[this.frontIndex++];
    if (this.frontIndex > 50 && this.frontIndex * 2 > this.items.length) {
      this.items = this.items.slice(this.frontIndex);
      this.frontIndex = 0;
    }
    return value;
  }

  peek() { return this.isEmpty() ? undefined : this.items[this.frontIndex]; }

  isEmpty() { return this.frontIndex >= this.items.length; }

  size() { return this.items.length - this.frontIndex; }
}

module.exports = { Queue };
