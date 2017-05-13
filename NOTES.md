I hoped to begin creating software which could support the creation, display, editting, and evaluation of calculations linked in directed acyclic graphs. Taking sequence alignment algorithms as an example, there is a huge gap between diagrams on paper and implementations in code, and it feels like there is room for an intermediate tool which would allow you to view all the steps of an algorithm, the output of each step, and the dependencies between steps. The problem does not feel esoteric to me, and I would be delighted to find something on the web that already does this.

In some cases, spreadsheets can bridge this gap, but there are shortcomings. Formulas are repeated down the column, rather than being defined once: To experiment with alternate functions, the cells must be replaced. Also, the dependencies between cells are not apparent. When editting one cell, there may be a color coding to indicate how it depends on other cells, but there is no way to get an overview of all relationships at once.

There are other classes of software which capture other aspects of the problem. CWL [maintains](https://github.com/common-workflow-language/common-workflow-language/wiki/Existing-Workflow-systems) a list of analysis workflow systems. These are much more powerful, and much more complicated than what I have imagined, but they do allow a sequence of operations to be specified, with the output of one process provided to the next. There are process-modelling frameworks like [Insight Maker](https://insightmaker.com/) or [Stella](https://www.iseesystems.com/) that emphasize graphical modeling of interactions, but model behavior over time, rather that just doing the calculations once. Finally, there is toolkits for mapping from UML diagrams to code.

My first stem was to find a Javascript library to manage drawing the boxes and arrows. I had used draw.io in the past, and found that the same folks have released [mxGraph](https://github.com/jgraph/mxgraph), a Javascript library for generating SVG. Looking into the API, I was pleasantly surprised to see that it is not based on graphical primitives ("square" or "line") but instead on graph relationships ("node" and "edge"). I also decided to use Javascript itself to evaluate expressions. Websites typically do not run javascript submitted by arbitrary users, because that is almost the definition of a cross-site scripting attack, so this need to be reconsidered if users are ever able to specify graphs, but for now it is sufficient. Connecting these two components is a function which finds a topological ordering of the graph and evaluates the nodes in order.

I've set up a demo at [mccalluc.github.io/dagsheet](https://mccalluc.github.io/dagsheet/?hello-world) which suggests both how it might work, and how much more work is necessary.

My first conclusion is that perhaps something exactly like this doesn't already exist, or at least no one that I've shown it to has suggested that I'm reinventing the wheel. I've also been forced to think through more clearly how it should work. I had thought initially that all nodes could be linked in a single DAG, but I've realized that it is useful to define functions as globals, and that these globals should have their own internal relationships.

There are several other areas I would like to improve.
- Cell edits are currently mispositioned. This is a regression.
- Dependent cells need to recalculate after edits.
- Users should be able to add new nodes and edges.
- When users are able to create graphs and edit calculations, there needs to be error handling.
- Users will also expect to be able to save and reload their graphs.
- Something like the "conditional formatting" of a spreadsheet would help to identify patterns in the outputs, perhaps adding a background color to a cell.
- There also needs to be a mechanism for controlling the display of a cell; For example, rounding after a given number of digits.
