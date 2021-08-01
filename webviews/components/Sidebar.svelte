<script lang="ts">
import { onMount } from "svelte";
import { keywords } from "../references";
// import Todos from "./Todos.svelte";

    // let accessToken = '';
    // let loading = true;
    // let user: User | null = null;
    // let lastState = tsvscode.getState();
    // let page: "todos" | "contact" = lastState?.page || "todos";
    // let text = lastState?.text || "";
    let lastState = tsvscode.getState();
    let listenSettingOn = lastState?.listenSettingOn || false;
    let notificationsSettingOn = lastState?.notificationsSettingOn || true;
    let toolboxInitiated = lastState?.toolboxInitiated || false;

    // will be called every time any variable in here changes
    $: {
        tsvscode.setState({ 
            listenSettingOn: listenSettingOn, 
            notificationsSettingOn: notificationsSettingOn, 
            toolboxInitiated: toolboxInitiated,
        });
    }

    // gets run when panel first gets mounted, good place to add listeners
    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data; // The json data that the extension sent
            switch (message.type) {
                // case 'token':
                //     accessToken = message.value;
                //     const response = await fetch(`${apiBaseUrl}/me`, {
                //         headers: {
                //             authorization: `Bearer ${accessToken}`,
                //         },
                //     });
                //     const data = await response.json();
                //     user = data.user;
                //     loading = false;
                //     break;
                case 'listening':
                    if (message.value === "on") {
                        listenSettingOn = true;
                    } else if (message.value === "off") {
                        listenSettingOn = false;
                    }
                    break;
            }
        });

        // tsvscode.postMessage({type: 'get-token', value: undefined});

        
    });
</script>

<style>
    h3 {
        display: inline-block;
        margin: 1px;
        padding: 3px;
    }

    h2 {
        border-bottom: 1px solid var(--vscode-input-placeholderForeground);
        padding: 1px;
    }

    .openToolbox {
        width: 100%;
    }

    .settingButton {
        float: right;
        padding: 3px 5px;
        margin: 1px;
    }

</style>

<!-- {#if loading}
    <div>loading...</div>
{:else if user} -->
    <!-- <pre>{JSON.stringify(user, null, 2)}</pre> -->
    <!-- {#if state.page === 'todos'}
        <Todos {user} {accessToken} bind:text/>
        <button on:click={() => {
            console.log(`clicked contact, state page: ${state.page}`);
            state = {
                page: 'contact',
            };
            lastState.text = text;
            console.log(`clicked contact-after, state page: ${state.page}`);
        }}>go to contact</button> -->
        <!-- svelte-ignore missing-declaration -->
        <button class="openToolbox" on:click={() => {
            tsvscode.postMessage({type: 'toolbox', value: undefined});
            toolboxInitiated = true;
        }}>Open Toolbox</button>
    {#if toolboxInitiated}
        <h2>Settings</h2>
    <div>
        <h3>Listening: </h3>
        {#if listenSettingOn}
            <!-- svelte-ignore missing-declaration -->
            <button class="settingButton" on:click={()=> {
            // send message to extension
            tsvscode.postMessage({type: 'stopListen', value: undefined});
            listenSettingOn = false; // might want to do this after getting confirmation?
            }}>ON</button>
            
        {:else}
            <!-- svelte-ignore missing-declaration -->
            <button class="settingButton" title="Turn on for suggested references" on:click={()=> {
            // send message to extension
            tsvscode.postMessage({type: 'startListen', value: keywords});
            listenSettingOn = true;
            }}>OFF</button>
        {/if}
    </div>
    <div>
        <h3>Notifications: </h3>
        {#if notificationsSettingOn}
            <!-- svelte-ignore missing-declaration -->
            <button class="settingButton" on:click={()=> {
            // send message to extension
            tsvscode.postMessage({type: 'stopNotifications', value: undefined});
            notificationsSettingOn = false; // might want to do this after getting confirmation?
            }}>ON</button>
            
        {:else}
            <!-- svelte-ignore missing-declaration -->
            <button class="settingButton" title="Turn on for reference notifcations" on:click={()=> {
            // send message to extension
            tsvscode.postMessage({type: 'startNotifications', value: undefined});
            notificationsSettingOn = true;
            }}>OFF</button>
        {/if}
    </div>
    {/if}
    <!-- {:else}
        <a href="https://scholar.google.com/citations?user=AVSNW8gAAAAJ&hl=en&oi=ao">Google Scholar Page</a>
        <button on:click={() => {
            console.log(`clicked back, state page: ${state.page}`);
            state = {
                page: 'todos',
                text: lastState.text,  
            };
            console.log(`clicked back-after, state page: ${state.page}`);
        }}>go back</button>
    {/if} -->
    <!-- svelte-ignore missing-declaration -->
    <!-- <button on:click={() => {
        accessToken='';
        user = null;
        tsvscode.postMessage({type: 'logout', value: undefined});
    }}>logout</button>
{:else} -->
    <!-- svelte-ignore missing-declaration -->
    <!-- <button on:click={() => {
        tsvscode.postMessage({type: 'authenticate', value: undefined});
    }}>login with GitHub</button>
{/if} -->

