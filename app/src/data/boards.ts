export type Task = { title: string; tags: string[] }
export type ColumnData = { name: string; tasks: Task[] }
export type Board = { columns: ColumnData[] }

// Invented for the demo. `data/taskBoardScenarios.json` holds what the suite
// expects, and `unit/boardData.test.ts` fails if the two drift apart.
export const webBoard: Board = {
  columns: [
    {
      name: 'To Do',
      tasks: [
        {
          title: 'Harden login input validation',
          tags: ['Feature', 'High Priority'],
        },
        { title: 'Fix flaky board test in WebKit', tags: ['Bug'] },
      ],
    },
    {
      name: 'In Progress',
      tasks: [{ title: 'Update glass theme tokens', tags: ['Design'] }],
    },
    { name: 'Done', tasks: [] },
  ],
}
