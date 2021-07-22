<script lang="ts">
    import { onMount } from "svelte";
    // import type { User, Ref } from "../types";
    import type { Ref } from "../references";
    // import  { apiBaseUrl } from "../../src/constants";
    import { REFERENCES } from "../references";
    import Icons from "./Icons.svelte";
    import { microphone, heart, bellIcon, book } from "../svgIcons";
    // let refs: Array<{ref: Ref, private: boolean, shared: boolean}> = [];
    // let refs: Array<{sourceName: string; sourceLink: string;}> =[];
    let text: string = "";
    let searchResults: Array<Ref> = REFERENCES;
    let listening: boolean = false;

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
    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data; // The json data that the extension sent
            switch (message.type) {
                case "new-ref":
                    // saveRef(message.value);
                    break;
                case "transcript": //or maybe "wordsDetected"
                  // search through Refs with keywords
                  console.log(`received on svelte side transcript: ${message.value}`)
                  searchRefs(message.value);
                  break;
            }

        });

        // To do: connect with API/database
        // const response = await fetch(`${apiBaseUrl}/todo`, {
        //     // no method specified = GET by default
        //     headers: {
        //         authorization: `Bearer ${accessToken}`,
        //     },
        // });
        // const payload = await response.json();
        // todos = payload.todos;
        
    });

</script>

<style>
  h3 {
    display: inline-block;
  }
</style>

<!-- TODO: Call this {user.name view}, add tooltip -->
<!-- click microphone icon to turn listening on/off, send message -->

<!-- <i class="fas fa-microphone fa-lg mr-2" on:click={()=>{

}}></i> -->
<div>
  {#if listening}
        <h3>Listening is</h3>
        <button on:click={()=> {
          // send message to extension
          tsvscode.postMessage({type: 'stopListen', value: undefined});
          listening = false; // might want to do this after getting confirmation?
        }}>ON</button>
    
  {:else}
    <h3>Listening is</h3>
    <button on:click={()=> {
      // send message to extension
      tsvscode.postMessage({type: 'startListen', value: undefined});
      listening = true;
    }}>OFF</button>
  {/if}
</div>

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

