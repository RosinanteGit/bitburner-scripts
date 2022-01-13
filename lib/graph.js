export function clone(graph) {
    return JSON.parse(JSON.stringify(graph));
}
export function addEdge(graph, source, destination) {
    if (graph[source] === undefined || graph[destination] === undefined) {
        return graph;
    }
    if (graph[source].includes(destination) || graph[destination].includes(source)) {
        return graph;
    }
    graph = clone(graph);
    graph[source].push(destination);
    graph[destination].push(source);
    return graph;
}
export function addVertex(graph, vertex) {
    graph = clone(graph);
    graph[vertex] = graph[vertex] ?? [];
    return graph;
}
export function removeEdge(graph, source, destination) {
    if (graph[source] === undefined || graph[destination] === undefined) {
        return graph;
    }
    graph = clone(graph);
    graph[source] = graph[source].filter(vertex => vertex !== destination);
    graph[destination] = graph[destination].filter(vertex => vertex !== source);
    return graph;
}
export function removeVertex(graph, vertex) {
    if (graph[vertex] === undefined) {
        return graph;
    }
    while (graph[vertex].length > 0) {
        const adjacentVertex = graph[vertex].pop();
        graph = removeEdge(graph, vertex, adjacentVertex);
    }
    delete graph[vertex];
    return graph;
}
export function findPath(graph, start, end) {
    let queue = [start];
    let visited = { [start]: true };
    let depth = { [start]: 0 };
    while (queue.length > 0) {
        let currVertex = queue.shift();
        for (let adjVertex of graph[currVertex]) {
            if (!visited[adjVertex]) {
                visited[adjVertex] = true;
                queue.push(adjVertex);
                depth[adjVertex] = depth[currVertex] + 1;
            }
        }
    }
    let path = [end];
    while (path[path.length - 1] !== start) {
        path.push(Object.keys(depth).find(vertex => depth[path[path.length - 1]] - 1 === depth[vertex] && graph[vertex].includes(path[path.length - 1])));
    }
    return path.reverse();
}
