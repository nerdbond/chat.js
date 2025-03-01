# Translation

Perhaps we can have the intermediate graph, Tool, be what we map source
languages into. Then Tool is translated into a Tool, which is a graph of
meaning.

```
source -> tool -> target
```

How do we go from one to the next?

## Source to Tool

This is done somehow through manual rules. We parse the source sentence
through manual rules. Then translate that labelled parse tree into a
Tool graph.

## Tool to Target

Then we take the Tool graph, and have manual rules to transform it into
target trees. Then the target tree is stringified.

## Example

Here, the `form` is the Tool syntax, normalized language structure, and
the `make` is the target language syntax (in this example, English).

```ts
// I like trees
form('[reference] [verb] [plural] [noun]').make(
  '[reference] [verb] [plural noun]',
)

// I like to move
form('[reference] [verb] [arrive] [verb]').make(
  '[reference] [verb] to [verb]',
)
```

How many patterns of basic sentences do you think are in English, along
these lines?
