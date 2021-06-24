<script lang="ts">
import { onMount } from "svelte";

    let accessToken = '';
    let loading = true;
    let user: {name: string, id: number} | null = null;

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
    <pre>{JSON.stringify(user, null, 2)}</pre>
{:else}
    <div>no user is logged in</div>
{/if}

