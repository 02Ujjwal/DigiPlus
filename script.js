const treeContainer = document.getElementById('tree-container');
const nodeValueInput = document.getElementById('node-value');
const addNodeButton = document.getElementById('add-node');
const updateNodeButton = document.getElementById('update-node');
const deleteNodeButton = document.getElementById('delete-node');

let currentNode = null;

class Node {
    constructor(value, children = []) {
        this.value = value;
        this.children = children;
    }

    addChild(node) {
        this.children.push(node);
    }

    removeChild(node) {
        this.children = this.children.filter(child => child !== node);
    }

    setValue(value) {
        this.value = value;
    }

    getJSON() {
        return {
            value: this.value,
            children: this.children.map(child => child.getJSON())
        };
    }
}

function createNodeElement(node, isSelected = false) {
    const div = document.createElement('div');
    div.classList.add('node');
    div.textContent = node.value;

    if (isSelected) {
        div.classList.add('selected');
    }

    div.addEventListener('click', () => {
        if (currentNode) {
            currentNode.classList.remove('selected');
        }
        currentNode = div;
        div.classList.add('selected');
    });

    return div;
}

function renderTree(node, parentElement) {
    node.children.forEach(child => {
        const childElement = createNodeElement(child);
        parentElement.appendChild(childElement);
        renderTree(child, childElement);
    });
}

addNodeButton.addEventListener('click', () => {
    const value = nodeValueInput.value.trim();
    if (!value) return;

    const newNode = new Node(value);
    if (currentNode) {
        currentNode.addChild(newNode);
        treeContainer.appendChild(createNodeElement(newNode, true));
    } else {
        treeContainer.appendChild(createNodeElement(newNode, true));
        currentNode = treeContainer.lastChild;
    }

    nodeValueInput.value = '';
});

updateNodeButton.addEventListener('click', () => {
    if (!currentNode) return;

    const value = nodeValueInput.value.trim();
    if (!value) return;

    currentNode.firstChild.textContent = value;
    currentNode.firstChild.previousSibling.value = value;
    currentNode.setValue(value);
});

deleteNodeButton.addEventListener('click', () => {
    if (!currentNode || !currentNode.parentNode) return;

    currentNode.parentNode.removeChild(currentNode);
    currentNode.removeChild(currentNode.firstChild);
});

// Initialize the tree with a root node
const rootNode = new Node('Root');
renderTree(rootNode, treeContainer);
currentNode = treeContainer.firstChild;