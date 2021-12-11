const insert = (arr, index, newItems) => [
  ...arr.slice(0, index),
  ...newItems,
  ...arr.slice(index)
]

const mention = (type) => {
  let className;
  switch (type) {
    case 'members':
    case 'channels':
      className = 'bg-blue bg-opacity-30 text-blue font-semibold rounded-sm px-1 py-0.5'
      break
    default:
      className = 'default'
  }

  return className
}

const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`

const getTypes = (nodeName) => {
  switch (nodeName) {
    case '#text':
      return 'text';
    case 'BR':
      return 'row';
    default:
      return 'text';
  }
}

export { insert, mention, getTypes, generateId }