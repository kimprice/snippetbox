<script lang="ts">
    // import { onMount } from "svelte";
    // import type { User, Ref } from "../types";
    // import type { Ref } from "../../src/references";
    // import  { apiBaseUrl } from "../../src/constants";
    // import  { REFERENCES } from "../../src/references";
    // let refs: Array<{ref: Ref, private: boolean, shared: boolean}> = [];
    let text: string;
    // let searchResults: Ref[] = REFERENCES;

    // will be called every time any variable in here changes
    // $: {
        //Maybe searchResults should be here
    //     tsvscode.setState({
    //         text: text,
    //     })
    // }

    // async function saveRef(t: string) {
    //         const response = await fetch(`${apiBaseUrl}/todo`, {
    //                 method: "POST",
    //                 body: JSON.stringify({
    //                     text: t,
    //                 }),
    //                 headers: {
    //                     "content-type": "application/json", // have to specify content type
    //                     authorization: `Bearer ${accessToken}`,
    //                 },
    //                 });
    //                 const { ref } = await response.json();
    //                 refs = [ref, ...refs];
    //         return
    //     }

    // function searchRefs(searchString: string) {
        // let keywords: string[] = searchString.split(" ");
        // TODO add logic for which references to show
        // return searchResults;
    // }

    // gets run when panel first gets mounted, good place to add listeners
    // onMount(async () => {
        // window.addEventListener("message", async (event) => {
        //     const message = event.data; // The json data that the extension sent
        //     switch (message.type) {
        //         case "new-ref":
        //             // saveRef(message.value);
        //             break;
        //     }
        // });

        // To do: connect with API/database
        // const response = await fetch(`${apiBaseUrl}/todo`, {
        //     // no method specified = GET by default
        //     headers: {
        //         authorization: `Bearer ${accessToken}`,
        //     },
        // });
        // const payload = await response.json();
        // todos = payload.todos;
        
    // });

</script>

<!-- TODO: Call this {user.name view} -->
<div>Private view</div>

<form
  on:submit|preventDefault={async () => {
    // todos = [{text, completed: false}, ...todos]
    // searchRefs(text); // this will update searchResults
    console.log(text);
    text = "";
  }}
>
  <input bind:value={text} />
</form>
