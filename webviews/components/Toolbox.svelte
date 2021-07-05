<script lang="ts">
    // import { onMount } from "svelte";
    // import type { User, Ref } from "../types";
    import type { Ref } from "../references";
    // import  { apiBaseUrl } from "../../src/constants";
    import { REFERENCES } from "../references";
    // let refs: Array<{ref: Ref, private: boolean, shared: boolean}> = [];
    // let refs: Array<{sourceName: string; sourceLink: string;}> =[];
    let text: string = "";
    let searchResults: Array<Ref> = REFERENCES;

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
    
    function searchRefs(searchString: string) {
      // clean text
      console.log(`searchString: ${searchString}`);   
      let keywords = searchString
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}@=\-_`~()]/g,"")
        .split(" ");
      console.log(`keywords ${keywords}`);
      searchResults = [];
      for (let i = 0; i<keywords.length; i++) {
        for (let j = 0; j<REFERENCES.length; j++) {
          if (REFERENCES[j].keywords.includes(keywords[i])) {
            searchResults.push(REFERENCES[j]);
            break;
          }
        }
      }
      console.log(`search results: ${searchResults}`);
      return searchResults;
    }

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
    searchRefs(text); // this will update searchResults
    // console.log(text);
    text = "";
  }}
>
  <input bind:value={text} />
</form>
<h1>{text}</h1>

{#each searchResults as result}
  <div>
    {#if result.open}
      <h3 on:click={()=> {
        result.open=false;
      }}>v  {result.sourceName}</h3>
      <a href={result.sourceLink}>Open Link in Browser</a>
      <p>{result.infoToDisplay}</p>
    {:else}
      <h3 on:click={()=> {
        result.open=true;
      }}>>  {result.sourceName}</h3>
    {/if}
  </div>
{/each}

