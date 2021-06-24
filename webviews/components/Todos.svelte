<script lang="ts">
import { onMount } from "svelte";


    let text = "";
    let todos: Array<{text: string, completed: boolean}> = []
        // gets run when panel first gets mounted, good place to add listeners
        onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data; // The json data that the extension sent
            switch (message.type) {
                case "new-todo":
                todos = [{text: message.value, completed: false}, ...todos]
                break;
            }
        });
        
    });
</script>

<style>
    .complete {
        text-decoration: line-through;
    }
</style>

<form on:submit|preventDefault={() => {
    todos = [{text, completed: false}, ...todos]
    text = '';
}}><input bind:value={text}/></form>

<!-- <pre>
    {JSON.stringify(todos, null, 2)}
</pre> -->

<ul>
    {#each todos as todo (todo.text)}
        <li
        class:complete={todo.completed} 
        on:click={() => {
            todo.completed = !todo.completed;
        }}>{todo.text}</li>
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