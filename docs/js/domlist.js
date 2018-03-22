export function add(list, text) {
  let textNode = $(document.createTextNode(text));
  let listItemNode = $("<li>");
  listItemNode.append(textNode);
  list.append(listItemNode);
}

export function clear(list) {
  list.empty();
}
