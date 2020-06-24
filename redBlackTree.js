class RedBlackTree {

    constructor() {
        this._root = null;
        this.BLACK = true;
        this.RED = false;
    }
    _findElement(key) {
        if (this._root === null) {
            return null;
        }
        let current = this._root;
        while (true) {
            if (key > current.key) {
                if (current.rightChild === null) {
                    break;
                } else {
                    current = current.rightChild;
                }
            } else {
                if (current.leftChild === null) {
                    break;
                } else {
                    current = current.leftChild;
                }
            }
        }
        return current;
    }

    _isRed(element) {
        if (element !== null) {
            return element.color === this.RED
        } else {
            return false;
        }
    }
    _balancing(element) {
        if ((element.parrent !== this._root) && (element !== this._root)) {
            let grandparent = element.parrent.parrent;
            let parrent = element.parrent;
            let isCase1 = (this._isRed(grandparent.leftChild)) && (this._isRed(grandparent.rightChild));
            let b1 = grandparent.leftChild === parrent;
            let b2 = parrent.rightChild === element;
            let b3 = grandparent.rightChild === parrent;
            let b4 = parrent.leftChild === element;
            let isCase2 = (b1 && b2) || (b3 && b4);
            let isCase3 = (this._isRed(grandparent.leftChild)) || (this._isRed(grandparent.rightChild));
            if (isCase1) {
                this._case1(element);
            } else if (isCase3) {
                if (isCase2) {
                    this._case2(element);
                } else {
                    this._case3(element);
                }
            }
        }
    }
    _rightRotation(element) {
        let grandparent = element.parrent.parrent;
        if (grandparent === this._root) {
            this._root = element.parrent;
        }
        let parrent = element.parrent;
        let c = parrent.rightChild;
        let tempParrent = grandparent.parrent;

        grandparent.parrent = parrent;
        parrent.rightChild = grandparent;
        parrent.parrent = tempParrent;
        grandparent.leftChild = c;
        parrent.color = this.BLACK;
        grandparent.color = this.RED;
        if (parrent.parrent !== null) {
            if (parrent.parrent.rightChild === grandparent) {
                parrent.parrent.rightChild = parrent;
            } else {
                parrent.parrent.leftChild = parrent;
            }
        }
    }

    _leftRotation(element) {
        let grandparent = element.parrent.parrent;
        if (grandparent === this._root) {
            this._root = element.parrent;
        }

        let parrent = element.parrent;
        let c = parrent.leftChild;
        let tempParrent = grandparent.parrent;

        grandparent.parrent = parrent;
        parrent.leftChild = grandparent;
        parrent.parrent = tempParrent;
        grandparent.rightChild = c;
        parrent.color = this.BLACK;
        grandparent.color = this.RED;
        if (parrent.parrent !== null) {
            if (parrent.parrent.leftChild === grandparent) {
                parrent.parrent.leftChild = parrent;
            } else {
                parrent.parrent.rightChild = parrent;
            }
        }
    }
    _case1(element) {
        let grandparent = element.parrent.parrent;
        grandparent.color = this.RED;
        if (grandparent === this._root) {
            grandparent.color = this.BLACK;
        }
        grandparent.leftChild.color = this.BLACK;
        grandparent.rightChild.color = this.BLACK;
        this._balancing(grandparent);
    }
    _case2(element) {
        let grandparent = element.parrent.parrent;
        let parrent = element.parrent;
        if (grandparent.leftChild === element.parrent) {
            grandparent.leftChild = element;
            element.parrent = grandparent;
            parrent.rightChild = null;
            element.leftChild = parrent;
            parrent.parrent = element;
        } else {
            grandparent.rightChild = element;
            element.parrent = grandparent;
            parrent.leftChild = null;
            element.rightChild = parrent;
            parrent.parrent = element;
        }
        this._balancing(parrent);
    }
    _case3(element) {
        let grandparent = element.parrent.parrent;
        if (grandparent.leftChild === element.parrent) {
            this._rightRotation(element);
        } else {
            this._leftRotation(element);
        }
        this._balancing(grandparent);
    }
    insert(key, value) {
        let parrent = this._findElement(key);

        let child = {
            key: key,
            value: value,
            parrent: parrent,
            leftChild: null,
            rightChild: null,
            color: this.RED
        }

        if (parrent === null) {
            child.color = this.BLACK;
            this._root = child;
        } else {
            if (key > parrent.key) {
                parrent.rightChild = child;
            } else {
                parrent.leftChild = child;
            }
        }

        if ((parrent !== null) && (parrent.color === this.RED)) {
            this._balancing(child);
        }
    }
}

