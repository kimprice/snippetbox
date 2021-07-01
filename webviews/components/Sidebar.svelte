<script lang="ts">
import { onMount } from "svelte";
import type { User, State } from "../types";
import Todos from "./Todos.svelte";

    let accessToken = '';
    let loading = true;
    let user: User | null = null;
    let lastState = tsvscode.getState();
    let page: "todos" | "contact" = lastState?.page || "todos";
    let text = lastState?.text || "";
    let state: State = {page, text};

    // will be called every time any variable in here changes
    $: {
        tsvscode.setState({state});
    }

    // gets run when panel first gets mounted, good place to add listeners
    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data; // The json data that the extension sent
            switch (message.type) {
                case 'token':
                    accessToken = message.value;
                    const response = await fetch(`${apiBaseUrl}/me`, {
                        headers: {
                            authorization: `Bearer ${accessToken}`,
                        },
                    });
                    const data = await response.json();
                    user = data.user;
                    loading = false;
            }
        });

        tsvscode.postMessage({type: 'get-token', value: undefined});

        
    });
</script>

{#if loading}
    <div>loading...</div>
{:else if user}
    <!-- <pre>{JSON.stringify(user, null, 2)}</pre> -->
    {#if state.page === 'todos'}
        <Todos {user} {accessToken} bind:text/>
        <button on:click={() => {
            console.log(`clicked contact, state page: ${state.page}`);
            state = {
                page: 'contact',
            };
            lastState.text = text;
            console.log(`clicked contact-after, state page: ${state.page}`);
        }}>go to contact</button>
    {:else}
        <a href="https://scholar.google.com/citations?user=AVSNW8gAAAAJ&hl=en&oi=ao">Google Scholar Page</a>
        <button on:click={() => {
            console.log(`clicked back, state page: ${state.page}`);
            state = {
                page: 'todos',
                text: lastState.text,  
            };
            console.log(`clicked back-after, state page: ${state.page}`);
        }}>go back</button>
    {/if}
    <button on:click={() => {
        accessToken='';
        user = null;
        tsvscode.postMessage({type: 'logout', value: undefined});
    }}>logout</button>
{:else}
    <button on:click={() => {
        tsvscode.postMessage({type: 'authenticate', value: undefined});
    }}>login with GitHub</button>
{/if}

