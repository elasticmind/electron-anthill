const _ = require('lodash');

function eqeqeqProperty(a, b, property) {
  return a[property] && b[property] && a[property] === b[property];
}

function eqeqeqProperties(a, b, properties) {
  const subjectFixedPredicate = _.unary(_.partial(eqeqeqProperty, a, b));
  return properties.every(subjectFixedPredicate);
}

function isEventUniqueByProperties(event, events, properties) {
  const predicate = _.unary(_.partialRight(eqeqeqProperties, event, properties));
  return !events.some(predicate);
}

const isEventUnique = _.partialRight(isEventUniqueByProperties, ['category', 'subcategory', 'channel']);
const isEventUniqueSubcategoryAgnostic = _.partialRight(isEventUniqueByProperties, ['category', 'channel']);

const linkPredicate = (node1, node2) => eqeqeqProperty(node1, node2, 'channel') && !eqeqeqProperty(node1, node2, 'subcategory');

export function getSimplifiedData(events) {
  const groupDictionary = {};
  const uniqueEvents = events
    .reduce((uniqueEvents, event) => {
      if (!(event.category in groupDictionary)) {
        groupDictionary[event.category] = Object.keys(groupDictionary).length;
      }
      if (isEventUnique(event, uniqueEvents)) {
        event.group = groupDictionary[event.category];
        uniqueEvents.push(event);
      }

      return uniqueEvents;
    }, []);

  const nodes = uniqueEvents.reduce(
    (events, event) => {
      if (isEventUniqueSubcategoryAgnostic(event, events)) {
        events.push({
          category: event.category,
          channel: event.channel,
          group: event.group,
        });
      }

      return events;
    },
    []
  );

  const {send: sendNodes, on: onNodes} = _.groupBy(uniqueEvents, 'subcategory');

  const findNodeForEvent = (event) => {
    return nodes.find((node) => eqeqeqProperties(event, node, ['category', 'channel']));
  };

  const links = [];
  if (sendNodes && onNodes) {
    sendNodes.forEach((source) => {
      onNodes.forEach((target) => {
        if (linkPredicate(source, target)) {
          links.push({
            source: findNodeForEvent(source),
            target: findNodeForEvent(target),
            value: 1,
          });
        }
      });
    });
  }

  return {
    nodes,
    links,
  };
}
