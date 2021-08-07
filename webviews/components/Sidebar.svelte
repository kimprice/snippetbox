<script lang="ts">
import { onMount } from "svelte";
import { keywords } from "../references";
import { STUDY_PW } from "../participantPW";

    let lastState = tsvscode.getState();
    let listenSettingOn = lastState?.listenSettingOn || false;
    let notificationsSettingOn = lastState?.notificationsSettingOn || true;
    let toolboxInitiated = lastState?.toolboxInitiated || false;
    let locked = lastState?.locked || true; // TODO change to true before starting study
    let pwText = "";

    // will be called every time any variable in here changes
    $: {
        tsvscode.setState({ 
            listenSettingOn: listenSettingOn, 
            notificationsSettingOn: notificationsSettingOn, 
            toolboxInitiated: toolboxInitiated,
            locked: locked,
        });
    }

    // gets run when panel first gets mounted, good place to add listeners
    onMount(async () => {
        tsvscode.postMessage({type: 'initialize', value: undefined});
        window.addEventListener("message", async (event) => {
            const message = event.data; // The json data that the extension sent
            switch (message.type) {
                case 'listening':
                    if (message.value === "on") {
                        listenSettingOn = true;
                    } else if (message.value === "off") {
                        listenSettingOn = false;
                    }
                    break;
                case 'initialize':
                    notificationsSettingOn = (message.value.charAt(0) === '1');
                    locked = (message.value.charAt(1) === '1');
                    break;
            }
        }); 
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
        margin-bottom: 10px;
    }

    .settingButton {
        float: right;
        padding: 3px 5px;
        margin: 1px;
    }

    .DECKS {
        text-align: center;
        margin-bottom: 10px;
    }

</style>
    
    <h3 class="DECKS"><strong>D</strong>ialogue-<strong>E</strong>nabled <strong>C</strong>oding <strong>K</strong>nowledge <strong>S</strong>upport</h3>
    {#if locked}
        <!-- svelte-ignore missing-declaration -->
        <form
        on:submit|preventDefault={async () => {
            if (pwText === STUDY_PW) { // prevention of toolbox use by participants before use
                tsvscode.postMessage({type: 'unlocked', value: undefined});
                locked = false;
            }
            pwText = "";
        }}
        >
        <input placeholder="Study password" type="password" bind:value={pwText} />
        </form>
    {:else}
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
        <h3 title="Listening must be on to receive notifications">Notifications: </h3>
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
    {/if} <!-- end of locked -->
