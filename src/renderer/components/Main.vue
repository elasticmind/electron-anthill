<template>
  <div class="wrapper">
    <!--<div class="graph-wrapper">
      <svg width="800" height="600"/>
    </div>-->
    <div class="w-half flex flex-h">
      <div class="w-half of-scroll">
        <event-list :events="events"/>
      </div>
      <div class="w-half flex flex-v">
        <div class="h-half">
            <events-options />
        </div>
        <div class="h-half">
          <event-details :event="selectedEvent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import EventDetails from '@/components/EventDetails';
import EventList from '@/components/EventList';
import EventsOptions from '@/components/EventsOptions';

let restart = () => {};

export default {
  components: {
    EventDetails,
    EventList,
    EventsOptions,
  },
  data() {
    return {
      sources: [],
    };
  },
  watch: {
    graph() {
      restart();
      console.log('restarted');
    },
  },
  computed: {
    graph() {
      return this.$store.getters.graph;
    },
    events() {
      return this.$store.getters.filteredEvents;
    },
    selectedEvent() {
      return this.$store.state.events.selectedEvent;
    },
  },
  mounted() {
    return;

    const svg = d3.select('svg');
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const valueline = d3
        .line()
        .x(function(d) {
          return d[0];
        })
        .y(function(d) {
          return d[1];
        })
        .curve(d3.curveCatmullRomClosed);
    const scaleFactor = 1.2;
    let polygon;
    let centroid;
    const curveTypes = [
      'curveBasisClosed',
      'curveCardinalClosed',
      'curveCatmullRomClosed',
      'curveLinearClosed',
    ];
    const simulation = d3
        .forceSimulation()
        .force(
            'link',
            d3.forceLink().id(function(d) {
              return d.id;
            })
        )
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2));

    // create selector for curve types
    const select = d3
        .select('#curveSettings')
        .append('select')
        .attr('class', 'select')
        .on('change', function() {
          const val = d3.select('select').property('value');
          d3.select('#curveLabel').text(val);
          valueline.curve(d3[val]);
          updateGroups();
        });
    select
        .selectAll('option')
        .data(curveTypes)
        .enter()
        .append('option')
        .text(function(d) {
          return d;
        });

    // create groups, links and nodes
    const groups = svg.append('g').attr('class', 'groups');

    let link = svg
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(this.graph.links)
        .enter()
        .append('line')
        .attr('stroke-width', function(d) {
          return Math.sqrt(d.value);
        });

    let node = svg
        .append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(this.graph.nodes)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', function(d) {
          return color(d.group);
        })
        .call(
            d3
                .drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended)
        );

    restart = () => {
      // Apply the general update pattern to the nodes.
      node = node.data(this.graph.nodes);
      node.exit().remove();
      node = node
          .enter()
          .append('circle')
          .attr('r', 5)
          .attr('fill', function(d) {
            return color(d.group);
          })
          .call(
              d3
                  .drag()
                  .on('start', dragstarted)
                  .on('drag', dragged)
                  .on('end', dragended)
          )
          .merge(node);

      // Apply the general update pattern to the links.
      link = link.data(this.graph.links, function(d) {
        return d.source.subcategory + '-' + d.target.subcagetory;
      });
      link.exit().remove();
      link = link
          .enter()
          .append('line')
          .merge(link);

      // Update and restart the simulation.
      // console.log('nodes', this.graph.nodes);
      console.log('nodes', this.graph.nodes);
      console.log('links', this.graph.links);
      simulation.nodes(this.graph.nodes);
      simulation.force('link').links(this.graph.links);
      simulation.alpha(1).restart();
    };

    // count members of each group. Groups with less
    // than 3 member will not be considered (creating
    // a convex hull need 3 points at least)
    const groupIds = d3
        .set(
            this.graph.nodes.map(function(n) {
              return +n.group;
            })
        )
        .values()
        .map((groupId) => {
          return {
            groupId: groupId,
            count: this.graph.nodes.filter(function(n) {
              return +n.group == groupId;
            }).length,
          };
        })
        .filter(function(group) {
          return group.count > 2;
        })
        .map(function(group) {
          return group.groupId;
        });

    const paths = groups
        .selectAll('.path_placeholder')
        .data(groupIds, function(d) {
          return +d;
        })
        .enter()
        .append('g')
        .attr('class', 'path_placeholder')
        .append('path')
        .attr('stroke', function(d) {
          return color(d);
        })
        .attr('fill', function(d) {
          return color(d);
        })
        .attr('opacity', 0);

    paths
        .transition()
        .duration(2000)
        .attr('opacity', 1);

    // add interaction to the groups
    groups.selectAll('.path_placeholder').call(
        d3
            .drag()
            .on('start', groupDragStarted)
            .on('drag', groupDragged)
            .on('end', groupDragEnded)
    );

    node.append('title').text(function(d) {
      return d.id;
    });

    simulation
        .nodes(this.graph.nodes)
    // .on('tick', ticked)
        .force('link')
        .links(this.graph.links);

    /*
    function ticked() {
      link
          .attr('x1', function(d) {
            return d.source.x;
          })
          .attr('y1', function(d) {
            return d.source.y;
          })
          .attr('x2', function(d) {
            return d.target.x;
          })
          .attr('y2', function(d) {
            return d.target.y;
          });
      node
          .attr('cx', function(d) {
            return d.x;
          })
          .attr('cy', function(d) {
            return d.y;
          });

      updateGroups();
    }*/

    // select nodes of the group, retrieve its positions
    // and return the convex hull of the specified points
    // (3 points as minimum, otherwise returns null)
    const polygonGenerator = function(groupId) {
      const nodeCoords = node
          .filter(function(d) {
            return d.group == groupId;
          })
          .data()
          .map(function(d) {
            return [d.x, d.y];
          });

      return d3.polygonHull(nodeCoords);
    };

    function updateGroups() {
      groupIds.forEach(function(groupId) {
        const path = paths
            .filter(function(d) {
              return d == groupId;
            })
            .attr('transform', 'scale(1) translate(0,0)')
            .attr('d', function(d) {
              polygon = polygonGenerator(d);
              centroid = d3.polygonCentroid(polygon);

              // to scale the shape properly around its points:
              // move the 'g' element to the centroid point, translate
              // all the path around the center of the 'g' and then
              // we can scale the 'g' element properly
              return valueline(
                  polygon.map(function(point) {
                    return [point[0] - centroid[0], point[1] - centroid[1]];
                  })
              );
            });

        d3.select(path.node().parentNode).attr(
            'transform',
            'translate(' +
            centroid[0] +
            ',' +
            centroid[1] +
            ') scale(' +
            scaleFactor +
            ')'
        );
      });
    }

    // drag nodes
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // drag groups
    function groupDragStarted(groupId) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d3.select(this) // eslint-disable-line
          .select('path')
          .style('stroke-width', 3);
    }

    function groupDragged(groupId) {
      node
          .filter(function(d) {
            return d.group == groupId;
          })
          .each(function(d) {
            d.x += d3.event.dx;
            d.y += d3.event.dy;
          });
    }

    function groupDragEnded(groupId) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d3.select(this) // eslint-disable-line
          .select('path')
          .style('stroke-width', 1);
    }
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

.wrapper {
  background-color: rgb(229, 229, 229);
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
}

.source-pane {
  flex-grow: 1;
  flex-basis: 0;
  margin: 10px;
  overflow: auto;
}

.flex {
  display: flex;
}

.flex-h {
  flex-direction: row;
}

.flex-v {
  flex-direction: column;
}

.w-half {
  width: 50%;
}

.h-half {
  height: 50%;
}

.h-full {
  height: 100%;
}

.of-scroll {
  overflow-y: scroll;
}

.graph-wrapper {
  width: 50%;
  height: 100vh;
}

.source-pane pre {
  width: 100%;
  overflow-x: scroll;
}

ul {
  list-style-type: none;
}

/* d3 */
.links line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: #fff;
  stroke-width: 1.5px;
}

path {
  fill-opacity: 0.1;
  stroke-opacity: 1;
}

svg {
  width: 100%;
  height: 100%;
}
</style>
