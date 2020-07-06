class RedBlackTree {

    constructor() {
        this._root = null;
        this.BLACK = true;
        this.RED = false;
        this.size = 0;
    }
    _findElement(key, start) {
        if (start === undefined) {
            start = this._root;
        }
        if (this._root === null) {
            return null;
        }

        let current = start;
        while (true) {
            if (key >= current.key) {
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

    _hasTwoNullChildren(element) {
        return (element.rightChild === null) && (element.leftChild === null);
    }

    _hasOneNullChild(element) {
        return (element.rightChild === null) && (element.leftChild !== null) ||
            (element.rightChild !== null) && (element.leftChild == null);
    }

    _isRightChild(element) {
        return element.parrent.rightChild === element;
    }

    _findElementForReplace(key) {
        let startElement = this.get(key);
        if (startElement !== null) {
            return this._findElement(key);
        } else {
            return null;
        }
    }

    _isRedOrNull(element) {
        return (element === null) || (element.color === this.RED);
    }

    _setNull(element) {
        if (this._isRightChild(element)) {
            if (element.rightChild === null) {
                element.parrent.rightChild = null;
            } else {
                element.parrent.rightChild = element.rightChild;
            }
        } else {
            element.parrent.leftChild = null;
        }
    }

    _replace(element, replacement) {
        if (replacement === null) {
            this._setNull(element);
        } else {
            element.key = replacement.key;
            this._setNull(replacement);
        }
    }

    _getNotNullChild(element) {
        if (element.rightChild !== null) {
            return element.rightChild;
        } else {
            return element.leftChild;
        }
    }

    _colorBlack(element) {
        if (element !== null) {
            element.color = this.BLACK;
        }
    }

    _getColor(element) {
        if (element === null) {
            return this.BLACK;
        } else {
            return element.color;
        }
    }

    _isCase2Delete(element) {
        let bothChildIsBlack = (this._getColor(element.rightChild) === this.BLACK) &&
            (this._getColor(element.leftChild) === this.BLACK);
        let w = element.leftChild;
        if (w === null) {
            return false;
        }
        let wIsBlack = this._getColor(w) === this.BLACK;
        let bothChildOfWisBlack = this._getColor(w.leftChild) && this._getColor(w.rightChild);
        return bothChildIsBlack && wIsBlack && bothChildOfWisBlack;
    }

    delete(key) {
        let element = this.get(key);

        let replacement;

        if (this._hasTwoNullChildren(element)) {
            replacement = null;
        }
        else if (this._hasOneNullChild(element)) {
            replacement = this._getNotNullChild(element);
        } else {
            replacement = this._findElement(key, element);
        }

        this._replace(element, replacement);

        //CASE0

        if (this._isRed(element.rightChild)) {
            this._colorBlack(element.rightChild);
        } else if (this._isCase2Delete(element)) {
            element.leftChild.color = this.RED;
            element.color = this.BLACK;
        }


    }

    _isRed(element) {
        if (element !== null) {
            return element.color === this.RED
        } else {
            return false;
        }
    }

    _isCase1(element) {
        let grandparent = element.parrent.parrent;
        let leftChildIsRed = this._isRed(grandparent.leftChild)
        let rightChildIsRed = this._isRed(grandparent.rightChild);
        return leftChildIsRed && rightChildIsRed;
    }

    _isCase2(element) {
        let grandparent = element.parrent.parrent;
        let parrent = element.parrent;
        let b1 = grandparent.leftChild === parrent;
        let b2 = parrent.rightChild === element;
        let b3 = grandparent.rightChild === parrent;
        let b4 = parrent.leftChild === element;
        let leftChildIsRed = this._isRed(grandparent.leftChild);
        let rightChildIsRed = this._isRed(grandparent.rightChild);
        let leftIsRedRightIsBlack = leftChildIsRed && !rightChildIsRed;
        let leftIsBlackRightIsRed = !leftChildIsRed && rightChildIsRed;
        let c2 = leftIsBlackRightIsRed || leftIsRedRightIsBlack;
        let c1 = ((b1 && b2) || (b3 && b4));
        return c1 && c2;
    }

    _isCase3(element) {
        let grandparent = element.parrent.parrent;
        let leftChildIsRed = this._isRed(grandparent.leftChild);
        let rightChildIsRed = this._isRed(grandparent.rightChild);
        return leftChildIsRed || rightChildIsRed;
    }
    _balancing(element) {
        if ((element.parrent !== this._root) && (element !== this._root)) {

            let isCase1 = this._isCase1(element);
            let isCase2 = this._isCase2(element);
            let isCase3 = this._isCase3(element);

            if (isCase1) {
                this._case1(element);
            } else if (isCase2) {
                this._case2(element);
            } else if (isCase3) {
                this._case3(element);
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
        this.size += 1;
    }

    get(key) {
        let current = this._root;
        while ((current.key !== key) && (current !== null)) {
            if (key > current.key) {
                current = current.rightChild;
            } else {
                current = current.leftChild;
            }
        }
        return current;
    }
}

