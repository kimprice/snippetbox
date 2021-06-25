<script lang="ts">
    import { onMount } from "svelte";
    import type { User } from "../types";
    
    export let user: User;
    export let accessToken: string;
    // let text = "";
    let todos: Array<{text: string, completed: boolean, id: number}> = []
    let text: string = "";

    // will be called every time any variable in here changes
    // $: {
    //     tsvscode.setState({text});
    // }
        // gets run when panel first gets mounted, good place to add listeners
    
        async function addTodo(t: string) {
            const response = await fetch(`${apiBaseUrl}/todo`, {
                    method: "POST",
                    body: JSON.stringify({
                        text: t,
                    }),
                    headers: {
                        "content-type": "application/json", // have to specify content type
                        authorization: `Bearer ${accessToken}`,
                    },
                    });
                    const { todo } = await response.json();
                    todos = [todo, ...todos];
            return
        }
    
    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data; // The json data that the extension sent
            switch (message.type) {
                case "new-todo":
                    addTodo(message.value);
                    break;
            }
        });

        const response = await fetch(`${apiBaseUrl}/todo`, {
            // no method specified = GET by default
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });
        const payload = await response.json();
        todos = payload.todos;
        
    });
</script>

<style>
    .complete {
      text-decoration: line-through;
    }
  </style>

<div>Hello: {user.name}</div>

<form
  on:submit|preventDefault={async () => {
    // todos = [{text, completed: false}, ...todos]
    addTodo(text);
    text = "";
  }}
>
  <input bind:value={text} />
</form>

<!-- <pre>
    {JSON.stringify(todos, null, 2)}
</pre> -->

<ul>
  {#each todos as todo (todo.id)}
    <li
      class:complete={todo.completed}
      on:click={async () => {
        todo.completed = !todo.completed;
        const response = await fetch(`${apiBaseUrl}/todo`, {
            method: 'PUT',
            body: JSON.stringify({
                id: todo.id,
            }),
            headers: {
                "content-type": "application/json", // have to specify content type
                authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(await response.json()); 
      }}
    >
      {todo.text}
    </li>
  {/each}
</ul>

<!-- <button on:click={() => {
    tsvscode.postMessage({
        type: 'onInfo',
        value: 'info message'
    });
}}>click me</button>

<button on:click={() => {
    tsvscode.postMessage({
        type: 'onError',
        value: 'error message'
    });
}}>click me for error</button> -->


